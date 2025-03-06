# Weglot Implementation
Place this script in Custom Code of your site to implement Weglot sitewide.

```html 
<!-- weglot code -->
<script type="text/javascript" src="https://cdn.weglot.com/weglot.min.js"></script>
<script>
    Weglot.initialize({
        api_key: 'wg_d20285e22d1d6fff188676f5a3b6c7fd5'
    });


// on Weglot init
Weglot.on('initialized', ()=>{
	// get the current active language
  const currentLang = Weglot.getCurrentLang();
  // call updateFlagDropdownLinks function
  updateSW6FlagDropdownLinks(currentLang);
});

// for each of the .wg-element-wrapper language links
document.querySelectorAll('.wg-element-wrapper.sw6 [lang]').forEach((link)=>{
		// add a click event listener
		link.addEventListener('click', function(e){
    	// prevent default
			e.preventDefault();
      // switch to the current active language      
      Weglot.switchTo(this.getAttribute('lang'));
      // call updateDropdownLinks function
      updateSW6FlagDropdownLinks(this.getAttribute('lang'));
		});
});

// updateFlagDropdownLinks function
function updateSW6FlagDropdownLinks(currentLang){
	// get the wrapper element
	const $wrapper = document.querySelector('.wg-element-wrapper.sw6'); 
  // if the .w-dropdown-toggle is not the current active language
 	if($wrapper.querySelector('.w-dropdown-toggle').getAttribute('lang') !== currentLang){
  	// swap the dropdown toggle's innerHTML with the current active language link innerHTML
  	const $activeLangLink = $wrapper.querySelector('[lang='+currentLang+']');
    const childDiv = $activeLangLink.innerHTML;
    const $toggle = $wrapper.querySelector('.w-dropdown-toggle');
    const toggleDiv = $toggle.innerHTML;
    $toggle.innerHTML = childDiv;
    $activeLangLink.innerHTML = toggleDiv;
    
    // swap the dropdown toggle's lang attr with the current active language link lang attr
		const lang = $activeLangLink.getAttribute('lang');
   	const toggleLang = $toggle.getAttribute('lang');
		$toggle.setAttribute('lang', lang);
		$activeLangLink.setAttribute('lang', toggleLang);
  }
}
</script>
```


