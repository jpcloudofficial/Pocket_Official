(() => {
    window.PocketFeatures = window.PocketFeatures || {};

    const ABOUT_ME_LINKS = [
        {
            label: 'Buy me a Ko-fi',
            href: 'https://ko-fi.com/jpcloud',
            icon: 'heart'
        },
        {
            label: 'Pocket repository on GitHub',
            href: 'https://github.com/jpcloudofficial/Pocket_Official',
            icon: 'laptop'
        },
        {
            label: 'Send feedback or report a bug',
            href: 'https://github.com/jpcloudofficial/Pocket_Official/issues',
            icon: 'alert-triangle'
        }
    ];

    function profileSettingsCard() {
        const profileName = typeof D.name === 'string' ? D.name.trim() : '';
        const profileInitials = profileName.split(/\s+/).slice(0, 2).map(part => part.charAt(0)).join('').toUpperCase() || 'P';
        const photoActions = `<div class="profile-photo-actions"><button type="button" class="b2 profile-photo-button" onclick="document.getElementById('profile-photo-input').click()">${D.profilePhoto ? 'Change photo' : 'Upload photo'}</button>${D.profilePhoto ? '<button type="button" class="profile-remove-photo" onclick="pocketApp.removeProfilePhoto()">Remove photo</button>' : ''}</div><input class="profile-photo-input" type="file" id="profile-photo-input" accept="image/*" aria-label="Choose a profile picture" onchange="pocketApp.uploadProfilePhoto(this)"><small class="profile-photo-note">Choose a photo from your device.</small>`;
        return `<div class="card profile-card" id="profile-settings" style="--profile-accent:${D.profileAccent}"><div class="profile-card-heading"><h3>Profile details</h3><p>Personalize your Pocket profile.</p></div><div class="profile-summary"><div class="profile-avatar" id="profile-avatar" aria-hidden="true"><span class="profile-avatar-fallback">${esc(profileInitials)}</span></div><div class="profile-identity"><strong id="profile-name-preview">${esc(profileName || 'Your profile')}</strong><small></small></div></div><div class="profile-photo-settings">${photoActions}</div><label class="profile-name-field">Display name<input id="profile-name" type="text" maxlength="32" autocomplete="name" aria-label="Profile display name" placeholder="Your name" value="${esc(D.name)}" onchange="D.name=this.value.trim().slice(0,32);save();render()"></label><div class="profile-email-row"><span>Account email</span><strong id="profile-email">Sign in to view</strong></div></div>`;
    }

    const cloudSyncCard = () =>
        `<div class="card cloud-sync-card" id="cloud-sync-card">
  <div class="cloud-sync-intro"><h3>Cloud sync</h3><p class="settings-note">Sync your data across devices.</p></div>
  <div class="cloud-sync-state"><p id="cloud-sync-status" class="cloud-sync-status" role="status">Connecting to Firebase…</p><small id="cloud-sync-mode" class="cloud-sync-mode">Local copy</small></div>
  <p class="cloud-sync-local-note">This device keeps its local copy.</p>
  <p class="cloud-sync-error" id="cloud-sync-error" role="alert" hidden></p>
  <div id="cloud-login-options"><button class="b2 cloud-google-button" type="button" data-cloud-action="google-sign-in">Continue with Google</button><details class="cloud-email-options"><summary>Use email instead</summary><form id="cloud-auth-form"><label>Email<input id="cloud-email" type="email" autocomplete="email" required></label><label>Password<input id="cloud-password" type="password" autocomplete="current-password" minlength="6" required></label><div class="settings-actions"><button class="b1" type="submit" data-cloud-action="sign-in">Sign in</button><button class="b2" type="button" data-cloud-action="signup">Create account</button><button class="b2" type="button" data-cloud-action="password-reset">Forgot password?</button></div></form></details></div>
  <div id="cloud-user-controls" hidden><div class="cloud-account-row"><div class="cloud-account-copy"><small>Signed in as</small><strong id="cloud-sync-email"></strong></div><button class="b2" type="button" data-cloud-action="sign-out">Sign out</button></div></div>
  <div id="cloud-conflict" class="cloud-conflict" hidden><p>Cloud data changed while this device also has local changes. Choose which copy to keep.</p><div class="settings-actions"><button class="b1" type="button" data-cloud-action="use-cloud">Use cloud copy</button><button class="b2" type="button" data-cloud-action="keep-local">Keep this device</button></div></div>
</div>`;

    const aboutMeCard = () => {
        const links = ABOUT_ME_LINKS.map(link =>
            `<a class="profile-about-link" href="${esc(link.href)}" target="_blank" rel="noopener noreferrer"><span class="profile-about-link-icon" aria-hidden="true">${ic(link.icon)}</span><span class="profile-about-link-label">${esc(link.label)}</span><span class="profile-about-link-arrow" aria-hidden="true">${ic('arrow-up-right')}</span></a>`
        ).join('');
        return `<section class="card profile-about-card" aria-labelledby="profile-about-title">
  <h3 class="profile-about-title" id="profile-about-title">About Me</h3>
  <div class="profile-about-header">
    <div class="profile-about-avatar" aria-hidden="true"><img src="src/presentation/profile/assets/cloud-avatar.png" alt=""></div>
    <div class="profile-about-identity"><strong>Cloud</strong><small>Creator of Pocket</small></div>
  </div>
  <div class="profile-about-copy">
    <h4>Hi, I'm the creator of Pocket.</h4>
    <p>Pocket started as a personal project to make managing money, tracking expenses, and organizing financial goals easier.</p>
    <details class="profile-about-more">
      <summary>More about me</summary>
      <div class="profile-about-more-copy">
        <p>I built Pocket to create a personal finance tool that feels straightforward, flexible, and easy to use every day. It's a project that continues to evolve as I learn, improve, and add new features.</p>
        <p>Thank you for using Pocket and being part of its journey.</p>
      </div>
    </details>
  </div>
  <nav class="profile-about-links" aria-label="About Cloud and Pocket links">${links}</nav>
</section>`;
    };

    V.prof = () =>
        `${window.PocketPageHeader({ eyebrow: 'A LITTLE MORE YOU', title: 'Your profile' })}<div class="g g2 profile-layout">${profileSettingsCard()}${cloudSyncCard()}${aboutMeCard()}</div>`;

    V.prof.onEnter = () => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        document.querySelectorAll('#m .profile-layout > .card').forEach((card, index) => {
            if (typeof card.animate !== 'function') return;
            const animation = card.animate([{
                    opacity: 0,
                    transform: 'translateY(14px) scale(.985)'
                },
                {
                    opacity: 1,
                    transform: 'translateY(0) scale(1)'
                }
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