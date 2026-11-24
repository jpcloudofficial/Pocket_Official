(() => {
    window.PocketFeatures = window.PocketFeatures || {};
        function profileSettingsCard() {
            const initial = D.name.trim().charAt(0).toUpperCase() || 'P';
            const colors = PROFILE_COLORS.map(([name, color]) =>
                `<button type="button" class="profile-color-swatch" style="--profile-swatch:${color}" aria-label="${name} profile color" aria-pressed="${D.profileAccent===color}" onclick="D.profileAccent='${color}';save();render()"></button>`
            ).join('');
            const photoActions = `<div class="profile-photo-actions"><button type="button" class="b2" onclick="document.getElementById('profile-photo-input').click()">${D.profilePhoto?'Change photo':'Upload photo'}</button>${D.profilePhoto?'<button type="button" class="b2" onclick="pocketApp.removeProfilePhoto()">Remove photo</button>':''}</div><input class="profile-photo-input" type="file" id="profile-photo-input" accept="image/*" aria-label="Choose a profile picture" onchange="pocketApp.uploadProfilePhoto(this)"><small class="profile-photo-note">Choose a photo from your device.</small>`;
            return `<div class="card profile-card" id="profile-settings" style="--profile-accent:${D.profileAccent}"><h3>Profile</h3><div class="profile-summary"><div class="profile-avatar" id="profile-avatar" aria-hidden="true"><span class="profile-avatar-fallback">${esc(initial)}</span>${D.profilePhoto?`<img src="${esc(D.profilePhoto)}" data-photo-url="${esc(D.profilePhoto)}" alt="">`:''}</div><div class="profile-identity"><strong id="profile-name-preview">${esc(D.name||'Your profile')}</strong><small>Personalize your Pocket profile</small>${photoActions}</div></div><label class="profile-name-field">Display name<input id="profile-name" type="text" maxlength="32" autocomplete="name" aria-label="Profile display name" placeholder="Your name" value="${esc(D.name)}" onchange="D.name=this.value.trim().slice(0,32);save();render()"></label><div class="profile-email-row"><span>Account email</span><strong id="profile-email">Sign in to see your account email.</strong></div><div class="profile-color-setting"><span>Profile color</span><div class="profile-color-options" role="group" aria-label="Profile color">${colors}</div></div><small class="settings-note">Your display name and profile color sync to your signed-in devices.</small></div>`;
        }

        const cloudSyncCard = () =>
            `<div class="card cloud-sync-card" id="cloud-sync-card">
  <div class="cloud-sync-intro"><h3>Cloud sync</h3><p class="settings-note">Sync your data across devices.</p></div>
  <p id="cloud-sync-status" class="cloud-sync-status" role="status">Connecting to Firebase…</p>
  <p class="cloud-sync-error" id="cloud-sync-error" role="alert" hidden></p>
  <div id="cloud-login-options"><button class="b2 cloud-google-button" type="button" data-cloud-action="google-sign-in">Continue with Google</button><details class="cloud-email-options"><summary>Use email instead</summary><form id="cloud-auth-form"><label>Email<input id="cloud-email" type="email" autocomplete="email" required></label><label>Password<input id="cloud-password" type="password" autocomplete="current-password" minlength="6" required></label><div class="settings-actions"><button class="b1" type="submit" data-cloud-action="sign-in">Sign in</button><button class="b2" type="button" data-cloud-action="signup">Create account</button><button class="b2" type="button" data-cloud-action="password-reset">Forgot password?</button></div></form></details></div>
  <div id="cloud-user-controls" hidden><div class="cloud-account-row"><div class="cloud-account-copy"><small>Signed in as</small><strong id="cloud-sync-email"></strong></div><button class="b2" type="button" data-cloud-action="sign-out">Sign out</button></div></div>
  <div id="cloud-conflict" class="cloud-conflict" hidden><p>Cloud data changed while this device also has local changes. Choose which copy to keep.</p><div class="settings-actions"><button class="b1" type="button" data-cloud-action="use-cloud">Use cloud copy</button><button class="b2" type="button" data-cloud-action="keep-local">Keep this device</button></div></div>
</div>`;

        V.prof = () =>
            `${window.PocketPageHeader({ title: 'Profile' })}<div class="g g2 profile-layout">${profileSettingsCard()}${cloudSyncCard()}</div>`;

    V.prof.onEnter = () => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        document.querySelectorAll('#m .profile-layout > .card').forEach((card, index) => {
            if (typeof card.animate !== 'function') return;
            const animation = card.animate([
                { opacity: 0, transform: 'translateY(14px) scale(.985)' },
                { opacity: 1, transform: 'translateY(0) scale(1)' }
            ], {
                duration: 360,
                delay: index * 65,
                easing: 'cubic-bezier(.22,.68,0,1)',
                fill: 'both'
            });
            animation.onfinish = () => animation.cancel();
        });
    };

    window.PocketFeatures['prof'] = V.prof;
})();
