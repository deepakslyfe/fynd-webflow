# Weglot Implementation
Place this script in Custom Code of your site to implement Weglot sitewide.

## Creating the custom switcher 
Create your custom switcher in Webflow designer, and assign the ID `custom-weglot` to it.
Hide it by default using the classname `display-none`. Make sure to add `display:none` to the class to hide it by default.
We will remove this class if the URL is included in translation.

```html 
<!-- weglot code -->
<script type="text/javascript" src="https://cdn.weglot.com/weglot.min.js"></script>
<script>
    // Initialize Weglot with your API key
    Weglot.initialize({
        api_key: 'wg_d20285e22d1d6fff188676f5a3b6c7fd5'
    });

    // On Weglot initialization
    Weglot.on('initialized', () => {
        console.log('[Weglot] Initialized');
        
        // Delay check slightly to ensure Weglot has fully setup
        setTimeout(() => {
            // Get both desktop and mobile switchers
            const desktopSwitcher = document.getElementById('custom-weglot');
            const mobileSwitcher = document.getElementById('custom-weglot-mob');
            
            // Check current URL path
            const isBlogPath = window.location.pathname.includes('/blog');
            console.log('[Weglot] Is blog path:', isBlogPath);
            
            // Determine if switchers should be visible
            const shouldHideSwitcher = isBlogPath || Weglot.options.language_button_displayed === false;
            
            if (!shouldHideSwitcher) {
                // Show desktop switcher if it exists
                if (desktopSwitcher) {
                    desktopSwitcher.classList.remove('display-none');
                    console.log('[Weglot] Showing desktop switcher');
                }
                
                // Show mobile switcher if it exists
                if (mobileSwitcher) {
                    mobileSwitcher.classList.remove('display-none');
                    console.log('[Weglot] Showing mobile switcher');
                }
                
                // Initialize with current language
                const currentLang = Weglot.getCurrentLang();
                if (desktopSwitcher) updateSwitcherLanguage(desktopSwitcher, currentLang);
                if (mobileSwitcher) updateSwitcherLanguage(mobileSwitcher, currentLang);
            }
        }, 500); // 500ms delay
    });

    // Setup event listeners for both switchers
    document.addEventListener('DOMContentLoaded', () => {
        // Setup desktop switcher
        setupSwitcherEvents('custom-weglot');
        
        // Setup mobile switcher
        setupSwitcherEvents('custom-weglot-mob');
    });

    // Function to setup event listeners for a specific switcher
    function setupSwitcherEvents(switcherId) {
        const switcher = document.getElementById(switcherId);
        if (!switcher) return;
        
        switcher.querySelectorAll('[lang]').forEach((link) => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const newLang = this.getAttribute('lang');
                
                // Switch to the selected language
                Weglot.switchTo(newLang);
                
                // Update both switchers
                const desktopSwitcher = document.getElementById('custom-weglot');
                const mobileSwitcher = document.getElementById('custom-weglot-mob');
                
                if (desktopSwitcher) updateSwitcherLanguage(desktopSwitcher, newLang);
                if (mobileSwitcher) updateSwitcherLanguage(mobileSwitcher, newLang);
            });
        });
    }

    // Function to update a single switcher's language display
    function updateSwitcherLanguage(switcherElement, currentLang) {
        const $toggle = switcherElement.querySelector('.w-dropdown-toggle');
        if (!$toggle) return;
        
        // If the toggle is not showing the current language
        if ($toggle.getAttribute('lang') !== currentLang) {
            // Find the element with the current language
            const $activeLangLink = switcherElement.querySelector('[lang="' + currentLang + '"]');
            if (!$activeLangLink) return;
            
            // Swap the dropdown toggle's innerHTML with the current active language link
            const childDiv = $activeLangLink.innerHTML;
            const toggleDiv = $toggle.innerHTML;
            $toggle.innerHTML = childDiv;
            $activeLangLink.innerHTML = toggleDiv;
            
            // Swap language attributes
            const lang = $activeLangLink.getAttribute('lang');
            const toggleLang = $toggle.getAttribute('lang');
            $toggle.setAttribute('lang', lang);
            $activeLangLink.setAttribute('lang', toggleLang);
        }
    }
</script>
```
---

## Media Translation
To change images when a user switches to a different language. 
https://youtu.be/v1A9nX4yhig?si=hcjeTKz2vu4SV4S4

---

## Changelog:
- 2023-08-23: GlamAr

### Webflow
- Removed `inline-block-linguana` element as it was not being used.
  - Its child `language-dropdown`
