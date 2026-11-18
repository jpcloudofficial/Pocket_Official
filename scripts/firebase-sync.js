import { firebaseConfig } from './firebase-config.js';

const DATA_KEY = 'pera.v1';
const SDK_BASE = 'https://www.gstatic.com/firebasejs/13.4.0';
const MAX_DOCUMENT_BYTES = 900000;
const main = document.querySelector('#m');

let authSdk;
let firestoreSdk;
let auth;
let database;
let user;
let stateRef;
let unsubscribe;
let authGeneration = 0;
let lastSyncedJson = null;
let pendingJson = null;
let writingJson = null;
let remoteConflict = null;
let syncReady = false;
let applyingRemote = false;
let dirty = false;
let saveTimer;
let statusMessage = 'Connecting to Firebase…';
let errorMessage = '';
let busy = false;

const statusElement = () => document.querySelector('#cloud-sync-status');
const errorElement = () => document.querySelector('#cloud-sync-error');
const showError = message => {
  errorMessage = message;
  updatePanel();
};

function updatePanel() {
  const status = statusElement();
  if (!status) return;
  status.textContent = user ? `${statusMessage} · ${user.email}` : statusMessage;
  const error = errorElement();
  error.textContent = errorMessage;
  error.hidden = !errorMessage;
  document.querySelector('#cloud-auth-form').hidden = Boolean(user);
  document.querySelector('#cloud-user-controls').hidden = !user;
  document.querySelector('#cloud-conflict').hidden = !remoteConflict;
  document.querySelectorAll('#cloud-sync-card button, #cloud-sync-card input').forEach(element => {
    element.disabled = busy;
  });
  document.querySelectorAll('#cloud-conflict button').forEach(element => {
    element.disabled = busy || Boolean(writingJson);
  });
}

function errorText(error) {
  const known = {
    'auth/email-already-in-use': 'That email already has an account. Sign in instead.',
    'auth/invalid-credential': 'The email or password is incorrect.',
    'auth/invalid-email': 'Enter a valid email address.',
    'auth/weak-password': 'Choose a password with at least 6 characters.',
    'auth/too-many-requests': 'Too many attempts. Wait a while and try again.',
    'permission-denied': 'Firestore denied access. Check that the published rules allow this signed-in user.',
    'unavailable': 'Firestore is unavailable. Your changes remain saved on this device.'
  };
  return known[error?.code] || error?.message || 'An unexpected Firebase error occurred.';
}

function backupLocalData(uid) {
  const localData = localStorage.getItem(DATA_KEY);
  if (!localData) return;
  const prefix = `${DATA_KEY}.cloud-backup.${uid}.`;
  const key = `${prefix}${Date.now()}`;
  localStorage.setItem(key, localData);
  const backups = [];
  for (let index = 0; index < localStorage.length; index++) {
    const candidate = localStorage.key(index);
    if (candidate?.startsWith(prefix)) backups.push(candidate);
  }
  backups.sort();
  while (backups.length > 3) localStorage.removeItem(backups.shift());
}

function serializeCurrentData() {
  return JSON.stringify(window.pocketApp.getData());
}

function queueSave(data) {
  if (!user || !stateRef || !syncReady || applyingRemote) return;
  const serialized = JSON.stringify(data);
  if (serialized === lastSyncedJson && !pendingJson) return;
  if (new TextEncoder().encode(serialized).length > MAX_DOCUMENT_BYTES) {
    clearTimeout(saveTimer);
    pendingJson = null;
    dirty = true;
    statusMessage = 'Cloud sync paused; data is still saved on this device.';
    showError('This Pocket backup is too large for the current single-document Firestore setup.');
    return;
  }
  pendingJson = serialized;
  dirty = true;
  statusMessage = remoteConflict ? 'Cloud changes need to be resolved.' : 'Changes waiting to sync…';
  updatePanel();
  if (remoteConflict) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(flushPending, 700);
}

async function flushPending() {
  if (!pendingJson || !stateRef || !user || remoteConflict || writingJson) return false;
  const serialized = pendingJson;
  const writeRef = stateRef;
  const generation = authGeneration;
  pendingJson = null;
  writingJson = serialized;
  try {
    await firestoreSdk.setDoc(writeRef, {
      data: JSON.parse(serialized),
      updatedAt: firestoreSdk.serverTimestamp()
    });
    if (generation !== authGeneration || stateRef !== writeRef) return true;
    lastSyncedJson = serialized;
    errorMessage = '';
    const currentJson = serializeCurrentData();
    if (pendingJson) {
      statusMessage = 'Changes waiting to sync…';
      clearTimeout(saveTimer);
      saveTimer = setTimeout(flushPending, 0);
    } else if (currentJson === serialized) {
      dirty = false;
      statusMessage = 'Synced to Firestore.';
    } else {
      queueSave(window.pocketApp.getData());
    }
    updatePanel();
    return true;
  } catch (error) {
    if (generation !== authGeneration || stateRef !== writeRef) return false;
    if (!pendingJson) pendingJson = serialized;
    dirty = true;
    statusMessage = 'Local copy is saved; cloud sync failed.';
    showError(errorText(error));
    return false;
  } finally {
    if (generation === authGeneration && stateRef === writeRef && writingJson === serialized) {
      writingJson = null;
      updatePanel();
    }
  }
}

function normalizeRemoteData(data) {
  const normalized = window.pocketApp.normalizeData(data);
  if (!normalized) throw new Error('Firestore returned data that is not a valid Pocket backup.');
  return normalized;
}

function applyRemoteData(data) {
  const normalized = normalizeRemoteData(data);
  const incomingJson = JSON.stringify(normalized);
  const localJson = serializeCurrentData();
  if (incomingJson !== localJson) backupLocalData(user.uid);
  clearTimeout(saveTimer);
  pendingJson = null;
  applyingRemote = true;
  try {
    window.pocketApp.replaceFromCloud(normalized);
  } finally {
    applyingRemote = false;
  }
  lastSyncedJson = incomingJson;
  const currentJson = serializeCurrentData();
  dirty = currentJson !== incomingJson;
  if (dirty) queueSave(window.pocketApp.getData());
  else {
    pendingJson = null;
    statusMessage = 'Synced to Firestore.';
    errorMessage = '';
    updatePanel();
  }
}

function handleRemoteSnapshot(snapshot) {
  if (!snapshot.exists() || snapshot.metadata.hasPendingWrites) return;
  try {
    const remoteData = normalizeRemoteData(snapshot.data().data);
    const remoteJson = JSON.stringify(remoteData);
    if (remoteJson === lastSyncedJson || remoteJson === writingJson || remoteJson === pendingJson) return;
    if (dirty || writingJson || pendingJson) {
      remoteConflict = remoteData;
      statusMessage = 'A different cloud copy arrived while this device had unsynced changes.';
      updatePanel();
      return;
    }
    applyRemoteData(remoteData);
    statusMessage = 'Updated from Firestore.';
  } catch (error) {
    showError(errorText(error));
  }
}

function startRemoteListener() {
  unsubscribe?.();
  unsubscribe = firestoreSdk.onSnapshot(stateRef, handleRemoteSnapshot, error => {
    statusMessage = 'Cloud updates are unavailable; this device remains usable.';
    showError(errorText(error));
  });
}

async function syncUserData(currentUser, generation) {
  syncReady = false;
  stateRef = firestoreSdk.doc(database, 'users', currentUser.uid, 'app', 'current');
  statusMessage = 'Loading your Firestore data…';
  updatePanel();
  const localJsonAtStart = serializeCurrentData();
  try {
    const snapshot = await firestoreSdk.getDocFromServer(stateRef);
    if (generation !== authGeneration) return;
    if (snapshot.exists()) {
      if (serializeCurrentData() !== localJsonAtStart) {
        remoteConflict = normalizeRemoteData(snapshot.data().data);
        dirty = true;
        statusMessage = 'Local changes were made while Firestore was loading. Choose which copy to keep.';
      } else {
        applyRemoteData(snapshot.data().data);
      }
    } else {
      const localJson = serializeCurrentData();
      if (new TextEncoder().encode(localJson).length > MAX_DOCUMENT_BYTES) {
        throw new Error('This Pocket backup is too large for the current single-document Firestore setup.');
      }
      await firestoreSdk.setDoc(stateRef, {
        data: JSON.parse(localJson),
        updatedAt: firestoreSdk.serverTimestamp()
      });
      if (generation !== authGeneration) return;
      lastSyncedJson = localJson;
      const currentJson = serializeCurrentData();
      dirty = currentJson !== localJson;
      statusMessage = dirty ? 'Changes waiting to sync…' : 'Synced to Firestore.';
      if (dirty) queueSave(window.pocketApp.getData());
    }
    if (generation !== authGeneration) return;
    syncReady = true;
    if (snapshot.exists()) {
      statusMessage = dirty ? 'Changes waiting to sync…' : 'Synced to Firestore.';
    }
    errorMessage = '';
    startRemoteListener();
    if (dirty) queueSave(window.pocketApp.getData());
    updatePanel();
  } catch (error) {
    if (generation !== authGeneration) return;
    syncReady = false;
    statusMessage = 'Could not load cloud data; your local copy is unchanged.';
    showError(errorText(error));
  }
}

function handleAuthState(currentUser) {
  authGeneration++;
  const generation = authGeneration;
  unsubscribe?.();
  unsubscribe = null;
  user = currentUser;
  stateRef = null;
  syncReady = false;
  pendingJson = null;
  writingJson = null;
  remoteConflict = null;
  dirty = false;
  clearTimeout(saveTimer);
  if (!currentUser) {
    lastSyncedJson = null;
    statusMessage = 'Signed out. This device keeps its local copy.';
    updatePanel();
    return;
  }
  lastSyncedJson = null;
  errorMessage = '';
  syncUserData(currentUser, generation);
}

async function withBusy(action) {
  if (busy) return;
  busy = true;
  errorMessage = '';
  updatePanel();
  try {
    await action();
  } catch (error) {
    showError(errorText(error));
  } finally {
    busy = false;
    updatePanel();
  }
}

async function submitCredentials(action) {
  const form = document.querySelector('#cloud-auth-form');
  if (!form?.reportValidity()) return;
  const email = document.querySelector('#cloud-email').value.trim();
  const password = document.querySelector('#cloud-password').value;
  await withBusy(async () => {
    if (!authSdk || !auth) throw new Error('Firebase is still initializing. Try again shortly.');
    statusMessage = action === 'signup' ? 'Creating your account…' : 'Signing in…';
    updatePanel();
    if (action === 'signup') await authSdk.createUserWithEmailAndPassword(auth, email, password);
    else await authSdk.signInWithEmailAndPassword(auth, email, password);
  });
}

async function handleCloudAction(action) {
  if (action === 'signup' || action === 'sign-in') {
    await submitCredentials(action === 'signup' ? 'signup' : 'signin');
    return;
  }
  if (action === 'password-reset') {
    const emailInput = document.querySelector('#cloud-email');
    if (!emailInput?.reportValidity()) return;
    await withBusy(async () => {
      if (!authSdk || !auth) throw new Error('Firebase is still initializing. Try again shortly.');
      await authSdk.sendPasswordResetEmail(auth, emailInput.value.trim());
      statusMessage = 'Password reset email sent.';
    });
    return;
  }
  if (action === 'sign-out') {
    await withBusy(async () => {
      if (pendingJson && !await flushPending()) {
        statusMessage = 'Signed out; unsynced changes remain on this device.';
      }
      await authSdk.signOut(auth);
    });
    return;
  }
  if (action === 'keep-local') {
    remoteConflict = null;
    dirty = true;
    queueSave(window.pocketApp.getData());
    return;
  }
  if (action === 'use-cloud' && remoteConflict) {
    await withBusy(async () => {
      const remoteData = remoteConflict;
      remoteConflict = null;
      applyRemoteData(remoteData);
    });
  }
}

document.addEventListener('submit', event => {
  if (event.target.id !== 'cloud-auth-form') return;
  event.preventDefault();
  submitCredentials('signin');
});

document.addEventListener('click', event => {
  const button = event.target.closest('[data-cloud-action]');
  if (button) handleCloudAction(button.dataset.cloudAction);
});

new MutationObserver(updatePanel).observe(main, { childList: true });
window.pocketCloud = { queueSave };
updatePanel();

window.addEventListener('online', () => {
  if (user && !syncReady) syncUserData(user, authGeneration);
  else if (pendingJson && !remoteConflict) flushPending();
});

(async () => {
  try {
    const [appSdk, loadedAuthSdk, loadedFirestoreSdk] = await Promise.all([
      import(`${SDK_BASE}/firebase-app.js`),
      import(`${SDK_BASE}/firebase-auth.js`),
      import(`${SDK_BASE}/firebase-firestore.js`)
    ]);
    authSdk = loadedAuthSdk;
    firestoreSdk = loadedFirestoreSdk;
    const app = appSdk.initializeApp(firebaseConfig);
    auth = authSdk.getAuth(app);
    database = firestoreSdk.getFirestore(app);
    statusMessage = 'Checking your sign-in…';
    updatePanel();
    authSdk.onAuthStateChanged(auth, handleAuthState, error => {
      statusMessage = 'Could not check your sign-in.';
      showError(errorText(error));
    });
  } catch (error) {
    statusMessage = 'Firebase could not be initialized.';
    showError(errorText(error));
  }
})();
