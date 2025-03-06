$(document).ready(function() {
    // Debug logger for the console
    function debugLog(message, data = null) {
      console.log(`[DEBUG] ${message}`, data || '');
    }
  
    debugLog('Starting to debug international phone selection');
    
    // Check if intlTelInput library is loaded
    if (typeof intlTelInput === 'undefined') {
      console.error('ERROR: intlTelInput library is not loaded. Please check if the library is included properly.');
      return;
    } else {
      debugLog('intlTelInput library is loaded correctly');
    }
    
    // Check if all required elements exist
    var elements = {
      form: document.querySelector("#cs_gated_form"),
      phoneInput: document.querySelector("#Phone-cs"),
      dialCode: document.querySelector("#cs-dialCode"),
      errorMsg: document.querySelector("#cs-error-msg"),
      validMsg: document.querySelector("#cs-valid-msg"),
      fullPhone: document.querySelector("#cs-fullPhone")
    };
    
    // Log which elements are found and which are missing
    var missingElements = [];
    Object.keys(elements).forEach(key => {
      if (!elements[key]) {
        missingElements.push(key);
        console.error(`ERROR: Element ${key} (${getElementSelector(key)}) not found in the DOM`);
      } else {
        debugLog(`Element ${key} found`, elements[key]);
      }
    });
    
    if (missingElements.length > 0) {
      console.error(`ERROR: Missing elements: ${missingElements.join(', ')}. Please check your HTML.`);
    }
    
    // Helper function to get the selector for an element key
    function getElementSelector(key) {
      const selectors = {
        form: "#cs_gated_form",
        phoneInput: "#Phone-cs",
        dialCode: "#cs-dialCode",
        errorMsg: "#cs-error-msg",
        validMsg: "#cs-valid-msg",
        fullPhone: "#cs-fullPhone"
      };
      return selectors[key] || key;
    }
    
    // If the phone input is missing, we can't proceed
    if (!elements.phoneInput) {
      return;
    }
    
    // Initialize the intlTelInput with extensive debugging
    try {
      debugLog('Initializing intlTelInput...');
      
      var iti = intlTelInput(elements.phoneInput, {
        initialCountry: "auto",
        strictMode: true,
        geoIpLookup: function(callback) {
          debugLog('Starting GeoIP lookup');
          fetch("https://ipapi.co/json")
            .then(function(res) {
              debugLog('GeoIP response received', res);
              if (!res.ok) {
                throw new Error(`GeoIP lookup failed with status: ${res.status}`);
              }
              return res.json();
            })
            .then(function(data) {
              debugLog('GeoIP data received', data);
              if (data && data.country_code) {
                debugLog(`Setting country to ${data.country_code}`);
                callback(data.country_code);
              } else {
                debugLog('No country code in GeoIP data, falling back to "in"');
                callback("in");
              }
            })
            .catch(function(error) {
              console.error('GeoIP lookup error:', error);
              debugLog('GeoIP lookup failed, falling back to "in"');
              callback("in");
            });
        },
        // Add more options for debugging
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js"
      });
      
      debugLog('intlTelInput initialized', iti);
      
      // Test if the instance was created correctly
      if (!iti) {
        console.error('ERROR: intlTelInput instance was not created properly');
        return;
      }
      
      // Test if the methods exist
      debugLog('Testing intlTelInput methods');
      try {
        var testCountryData = iti.getSelectedCountryData();
        debugLog('getSelectedCountryData works', testCountryData);
      } catch (e) {
        console.error('ERROR: Could not call getSelectedCountryData', e);
      }
      
      // Update dial code immediately after initialization
      if (elements.dialCode) {
        try {
          var initialCountryData = iti.getSelectedCountryData();
          if (initialCountryData && initialCountryData.dialCode) {
            elements.dialCode.value = "+" + initialCountryData.dialCode;
            debugLog('Initial dial code set', {
              country: initialCountryData.name,
              dialCode: initialCountryData.dialCode,
              inputValue: elements.dialCode.value
            });
          } else {
            console.error('ERROR: Could not get initial country data or dial code');
          }
        } catch (e) {
          console.error('ERROR: Could not set initial dial code', e);
        }
      }
      
      // Define update function
      var updateInputValue = function(event) {
        debugLog('updateInputValue called', { eventType: event.type });
        
        try {
          var countryData = iti.getSelectedCountryData();
          debugLog('Country data retrieved', countryData);
          
          if (countryData && countryData.dialCode && elements.dialCode) {
            elements.dialCode.value = "+" + countryData.dialCode;
            debugLog('Dial code updated', {
              country: countryData.name,
              dialCode: countryData.dialCode,
              inputValue: elements.dialCode.value
            });
          } else {
            console.error('ERROR: Could not update dial code. Missing data:', {
              countryData: countryData,
              dialCodeElement: elements.dialCode
            });
          }
        } catch (e) {
          console.error('ERROR: Exception when updating dial code', e);
        }
      };
      
      // Add event listeners with proper error handling
      try {
        elements.phoneInput.addEventListener('input', function(event) {
          debugLog('input event triggered', { value: elements.phoneInput.value });
          updateInputValue(event);
        }, false);
        
        elements.phoneInput.addEventListener('countrychange', function(event) {
          debugLog('countrychange event triggered');
          updateInputValue(event);
        }, false);
        
        debugLog('Event listeners added successfully');
      } catch (e) {
        console.error('ERROR: Could not add event listeners', e);
      }
      
      // Add a test button to manually trigger country change
      var testButton = document.createElement('button');
      testButton.textContent = 'Test Country Change';
      testButton.style.marginTop = '10px';
      testButton.type = 'button';
      testButton.addEventListener('click', function() {
        debugLog('Manually testing country change to US');
        try {
          iti.setCountry('us');
          debugLog('Country set to US');
        } catch (e) {
          console.error('ERROR: Could not set country to US', e);
        }
      });
      
      // Add the button after the phone input
      if (elements.phoneInput.parentNode) {
        elements.phoneInput.parentNode.insertBefore(testButton, elements.phoneInput.nextSibling);
      }
      
      // Add form submission debug handler
      if (elements.form) {
        elements.form.addEventListener('submit', function(e) {
          e.preventDefault(); // Prevent actual submission for testing
          
          debugLog('Form submission attempted');
          
          // Check if the phone fields are working correctly
          if (elements.dialCode && elements.phoneInput && elements.fullPhone) {
            var dialCodeValue = elements.dialCode.value;
            var phoneValue = elements.phoneInput.value;
            var fullPhone = `${dialCodeValue} ${phoneValue}`;
            
            elements.fullPhone.value = fullPhone;
            
            debugLog('Phone values at submission', {
              dialCode: dialCodeValue,
              phone: phoneValue,
              fullPhone: fullPhone,
              fullPhoneInput: elements.fullPhone.value
            });
          } else {
            console.error('ERROR: Missing phone related elements for submission');
          }
          
          debugLog('Form would be submitted with these values:', {
            name: $('#Name-cs').val(),
            email: $('#Email-cs').val(),
            phone: $('#Phone-cs').val(),
            dialCode: $('#cs-dialCode').val(),
            fullPhone: $('#cs-fullPhone').val(),
            pageUrl: $('#Page-Url').val()
          });
          
          // Show a debug message
          alert('DEBUG: Form submission prevented for testing. Check console for details.');
        });
      }
      
    } catch (error) {
      console.error('ERROR: Exception when initializing intlTelInput', error);
    }
    
    // Add some CSS to help with debugging
    $("<style>")
      .prop("type", "text/css")
      .html(`
        .debug-outline { outline: 2px solid red !important; }
        .debug-success { background-color: #d4edda; color: #155724; padding: 10px; margin: 10px 0; border-radius: 4px; }
        .debug-error { background-color: #f8d7da; color: #721c24; padding: 10px; margin: 10px 0; border-radius: 4px; }
      `)
      .appendTo("head");
    
    // Outline the phone-related elements to check if they exist and are positioned correctly
    $("#Phone-cs, #cs-dialCode, #cs-fullPhone").addClass("debug-outline");
    
    debugLog('Debug initialization complete');
  });