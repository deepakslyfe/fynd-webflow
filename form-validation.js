/**
 * Combined Form Validation Script for Webflow
 * Includes:
 * - International phone validation
 * - Required field validation
 * - Form submission handling
 * - Page URL capture
 * - Debug logging
 */

// Main function that contains all functionality
(function() {
  // Debug mode - set to false for production
  const DEBUG = true;
  
  // Debug logger function
  function debugLog(message, data) {
    if (!DEBUG) return;
    console.log(`[DEBUG] ${message}`, data || '');
  }
  
  // Log any errors that occur
  function debugError(message, error) {
    if (!DEBUG) return;
    console.error(`[ERROR] ${message}`, error || '');
  }
  
  // Wait for document ready
  function onDocumentReady(callback) {
    if (document.readyState !== 'loading') {
      callback();
    } else {
      document.addEventListener('DOMContentLoaded', callback);
    }
  }
  
  // Initialize all functionality
  onDocumentReady(function() {
    debugLog('Document ready, initializing form validation');
    
    // Give the page a moment to fully render before initializing
    // This helps avoid conflicts with other scripts
    setTimeout(() => {
      // Initialize all components
      initPhoneValidation();
      initRequiredFieldValidation();
      initFormSubmission();
      initPageUrlCapture();
      initFormValidator();
      
      // Add a manual initialization button in debug mode
      if (DEBUG) {
        const reinitButton = document.createElement('button');
        reinitButton.textContent = 'Reinitialize Phone Input';
        reinitButton.style.cssText = `
          position: fixed;
          bottom: 50px;
          right: 10px;
          z-index: 10000;
          padding: 5px;
          background: #333;
          color: #fff;
          border: none;
          border-radius: 3px;
          font-size: 12px;
        `;
        
        reinitButton.addEventListener('click', () => {
          debugLog('Manual reinitialization requested');
          initPhoneValidation();
        });
        
        document.body.appendChild(reinitButton);
      }
    }, 500); // Half-second delay to ensure page is fully loaded
    
    // Add inline debug panel if in debug mode
    if (DEBUG) {
      addDebugPanel();
    }
    
    debugLog('All components initialized');
  });
  
  // 1. Phone Validation
  function initPhoneValidation() {
    debugLog('Initializing phone validation');
    
    // Add required intlTelInput CSS if not already added
    if (!document.querySelector('link[href*="intl-tel-input"]')) {
      const linkElement = document.createElement('link');
      linkElement.rel = 'stylesheet';
      linkElement.href = 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/css/intlTelInput.css';
      document.head.appendChild(linkElement);
      debugLog('Added intlTelInput CSS');
    }
    
    // Add custom CSS to handle multiple instances correctly
    const customStyleEl = document.createElement('style');
    customStyleEl.textContent = `
      /* Ensure proper display of international phone input */
      .iti {
        width: 100%;
        display: block;
        position: relative;
      }
      .iti__flag-container {
        position: absolute;
        top: 0;
        bottom: 0;
        padding: 1px;
      }
      /* Fix any z-index issues */
      .iti__country-list {
        z-index: 999;
      }
      /* Make sure inputs have proper padding for the country selector */
      input#phone-cs {
        padding-left: 52px !important;
      }
    `;
    document.head.appendChild(customStyleEl);
    debugLog('Added custom phone input CSS fixes');
    
    try {
      // Check if intlTelInput is available
      if (typeof intlTelInput === 'undefined') {
        throw new Error('intlTelInput library not found. Make sure it is loaded before this script.');
      }
      
      // Get required elements
      const input = document.querySelector("#phone-cs"); // Note: lowercase 'p' in your form
      const dialCode = document.querySelector("#cs-dialCode");
      const errorMsg = document.querySelector("#cs-error-msg");
      const validMsg = document.querySelector("#cs-valid-msg");
      
      // Check if the phone input already has intlTelInput initialized
      if (input && input.classList.contains('iti__tel-input')) {
        debugLog('Phone input already has intlTelInput initialized, will not initialize again');
        return null;
      }
      
      // Check if the parent element already has the iti container
      if (input && input.parentElement && input.parentElement.querySelector('.iti__flag-container')) {
        debugLog('Parent element already has intlTelInput initialized, will not initialize again');
        return null;
      }
      
      // Check if elements exist
      if (!input) {
        throw new Error('Phone input element #Phone-cs not found');
      }
      if (!dialCode) {
        throw new Error('Dial code element #cs-dialCode not found');
      }
      
      debugLog('Phone elements found', { input, dialCode, errorMsg, validMsg });
      
      // Destroy any existing instances first to avoid conflicts
      if (input && typeof input.iti !== 'undefined') {
        try {
          input.iti.destroy();
          debugLog('Destroyed existing intlTelInput instance');
        } catch (e) {
          debugError('Failed to destroy existing intlTelInput instance', e);
        }
      }
      
      // Remove any existing iti elements to completely reset
      if (input && input.parentElement) {
        const existingIti = input.parentElement.querySelector('.iti');
        if (existingIti) {
          // Clone the input
          const clone = input.cloneNode(true);
          // Replace the parent with the clone
          existingIti.parentNode.replaceChild(clone, existingIti);
          // Update our reference
          input = clone;
          debugLog('Removed existing ITI container and reset input');
        }
      }
      
      // Initialize intlTelInput with expanded options
      const iti = intlTelInput(input, {
        initialCountry: "auto",
        strictMode: true,
        separateDialCode: true, // Show the dial code separately
        allowDropdown: true,    // Allow the dropdown
        autoPlaceholder: "aggressive",
        preferredCountries: ["in", "us", "gb"], // Default to showing these first
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js",
        geoIpLookup: (callback) => {
          debugLog('Starting GeoIP lookup');
          fetch("https://ipapi.co/json")
            .then((res) => {
              if (!res.ok) {
                throw new Error(`GeoIP API returned ${res.status}: ${res.statusText}`);
              }
              return res.json();
            })
            .then((data) => {
              debugLog('GeoIP lookup successful', data);
              callback(data.country_code);
            })
            .catch((error) => {
              debugError('GeoIP lookup failed', error);
              callback("in");
            });
        },
      });
      
      debugLog('intlTelInput initialized', iti);
      
      // Store the instance on the input element itself for future reference
      input.iti = iti;
      
      // Force a redraw of the phone input container
      setTimeout(() => {
        // Add a class to the parent container to ensure styles apply
        if (input.parentElement) {
          input.parentElement.classList.add('iti-enabled');
          debugLog('Added iti-enabled class to parent');
        }
        
        // Make sure the flag container is visible
        const flagContainer = input.parentElement ? 
          input.parentElement.querySelector('.iti__flag-container') : null;
        
        if (flagContainer) {
          flagContainer.style.display = 'block';
          debugLog('Ensured flag container is visible');
        } else {
          debugError('Could not find flag container');
        }
      }, 100);
      
      // Set initial dial code value
      try {
        const initialData = iti.getSelectedCountryData();
        if (initialData && initialData.dialCode) {
          dialCode.value = "+" + initialData.dialCode;
          debugLog('Initial dial code set', { dialCode: dialCode.value });
        }
      } catch (e) {
        debugError('Failed to set initial dial code', e);
      }
      
      // Update dial code when country changes
      const updateInputValue = function(event) {
        try {
          const countryData = iti.getSelectedCountryData();
          if (countryData && countryData.dialCode) {
            dialCode.value = "+" + countryData.dialCode;
            debugLog('Updated dial code', {
              event: event.type,
              country: countryData.iso2,
              dialCode: dialCode.value
            });
          } else {
            debugError('Country data not available');
          }
        } catch (e) {
          debugError('Error updating dial code', e);
        }
      };
      
      // Add event listeners for phone input
      input.addEventListener('input', updateInputValue, false);
      input.addEventListener('countrychange', updateInputValue, false);
      
      // Error messages for validation
      const errorMap = [
        "Please enter a valid phone number", 
        "Invalid country code", 
        "Phone number too short", 
        "Phone number too long", 
        "Invalid phone number"
      ];
      
      // Reset validation state
      const reset = function() {
        input.classList.remove("error");
        if (errorMsg) {
          errorMsg.innerHTML = "";
          errorMsg.classList.add("errorhide");
        }
        if (validMsg) {
          validMsg.classList.add("errorhide");
        }
        debugLog('Phone validation state reset');
      };
      
      // Regular expression for validating phone numbers
      const phoneRegex = /^(?:[0-9]●?){6,14}[0-9]$/;
      
      // Function to validate phone number
      function isValidPhoneNumber(phoneNumber) {
        const isValid = phoneRegex.test(phoneNumber);
        debugLog('Phone regex validation', { phoneNumber, isValid });
        return isValid;
      }
      
      // Validate phone on blur
      input.addEventListener('blur', function() {
        debugLog('Phone input blur event', { value: input.value });
        reset();
        
        const phoneNumber = input.value;
        
        // Validate with regex
        if (phoneNumber && !isValidPhoneNumber(phoneNumber)) {
          input.classList.add('invalid');
          debugLog('Phone failed regex validation');
        } else {
          input.classList.remove('invalid');
        }
        
        // Validate with intlTelInput
        if (input.value.trim()) {
          const isValidNumber = iti.isValidNumber();
          debugLog('intlTelInput validation', { isValid: isValidNumber });
          
          if (isValidNumber) {
            if (validMsg) {
              validMsg.classList.remove("errorhide");
            }
            debugLog('Phone number is valid');
          } else {
            input.classList.add("error");
            if (errorMsg) {
              const errorCode = iti.getValidationError();
              errorMsg.innerHTML = errorMap[errorCode];
              errorMsg.classList.remove("errorhide");
              debugLog('Phone validation error', { 
                errorCode, 
                errorMessage: errorMap[errorCode] 
              });
            }
          }
        }
      });
      
      // Reset validation on input
      input.addEventListener('change', reset);
      input.addEventListener('keyup', reset);
      
      debugLog('Phone validation initialized successfully');
      
      // If in debug mode, add a test button
      if (DEBUG) {
        const testButton = document.createElement('button');
        testButton.type = 'button';
        testButton.textContent = 'Test Phone Format';
        testButton.style.marginTop = '10px';
        testButton.style.marginBottom = '10px';
        testButton.style.padding = '5px';
        testButton.style.fontSize = '12px';
        testButton.style.backgroundColor = '#f0f0f0';
        
        testButton.addEventListener('click', function() {
          debugLog('Testing phone format');
          
          // Output current values
          debugLog('Current phone values', {
            phoneValue: input.value,
            dialCode: dialCode.value,
            fullPhone: `${dialCode.value} ${input.value}`,
            isValid: iti.isValidNumber(),
            countryData: iti.getSelectedCountryData()
          });
          
          // Test with a few sample countries
          const testCountries = ['us', 'gb', 'in', 'au'];
          const currentCountry = iti.getSelectedCountryData().iso2;
          const nextCountry = testCountries.find(c => c !== currentCountry) || 'us';
          
          try {
            iti.setCountry(nextCountry);
            debugLog(`Set country to ${nextCountry}`);
          } catch (e) {
            debugError('Failed to change country', e);
          }
        });
        
        // Add button after phone input
        if (input.parentNode) {
          input.parentNode.insertBefore(testButton, input.nextSibling);
        }
      }
      
      return { input, dialCode, iti }; // Return for use in other functions
    } catch (error) {
      debugError('Failed to initialize phone validation', error);
      return null;
    }
  }
  
  // 2. Required Field Validation
  function initRequiredFieldValidation() {
    debugLog('Initializing required field validation');
    
    try {
      // Validate required fields on blur
      $(document).on('blur', ':input[required]', function() {
        const field = $(this);
        const fieldName = field.attr('name') || field.attr('id') || 'unnamed field';
        const isEmpty = field.val() === '';
        
        debugLog(`Required field blur: ${fieldName}`, { isEmpty });
        
        if (isEmpty) {
          field.addClass('invalid');
        } else {
          field.removeClass('invalid');
        }
      });
      
      // Validate on any submit button click within a form
      $(document).on('click', 'form button[type="submit"]', function() {
        debugLog('Submit button clicked');
        
        const requiredFields = $(':input[required]');
        let isValid = true;
        let invalidFields = [];
        
        requiredFields.each(function() {
          const field = $(this);
          const fieldName = field.attr('name') || field.attr('id') || 'unnamed field';
          const isEmpty = field.val() === '';
          
          debugLog(`Validating field: ${fieldName}`, { isEmpty });
          
          if (isEmpty) {
            field.addClass('invalid');
            isValid = false;
            invalidFields.push(fieldName);
          } else {
            field.removeClass('invalid');
          }
        });
        
        debugLog('Form validation result', { 
          isValid, 
          invalidFields: invalidFields.length ? invalidFields : 'none'
        });
      });
      
      debugLog('Required field validation initialized');
    } catch (error) {
      debugError('Failed to initialize required field validation', error);
    }
  }
  
  // 3. Form Submission
  function initFormSubmission() {
    debugLog('Initializing form submission handler');
    
    try {
      // Try to find the form using either the original ID or the actual ID from your HTML
    let form = $('#cs_gated_form');
    
    if (form.length === 0) {
      form = $('#wf-form-CS-Gated-Form');
      
      if (form.length === 0) {
        debugLog('Warning: Neither #cs_gated_form nor #wf-form-CS-Gated-Form found');
      } else {
        debugLog('Found form with ID #wf-form-CS-Gated-Form');
      }
    } else {
      debugLog('Found form with ID #cs_gated_form');
    }
    
    if (form.length === 0) {
      throw new Error('Form not found');
      }
      
      // Set the actual form ID from your HTML
      const formId = '#wf-form-CS-Gated-Form';
      const actualForm = $(formId);
      
      if (actualForm.length === 0) {
        debugLog(`Form with ID ${formId} not found, still using #cs_gated_form as fallback`);
      } else {
        debugLog(`Found form with ID ${formId}`);
        form = actualForm;
      }
      
      // Handle form submission
      form.on('submit', function(e) {
        // For debugging purposes, prevent submission
        if (DEBUG) {
          e.preventDefault();
          debugLog('Form submission prevented in debug mode');
        }
        
        debugLog('Form submitted');
        
        // Combine phone parts
        const dialCode = $('#cs-dialCode').val();
        const phone = $('#phone-cs').val(); // Note: lowercase 'p' in your form
        const fullPhone = `${dialCode} ${phone}`;
        
        $('#cs-fullPhone').val(fullPhone);
        
        debugLog('Combined phone value', { 
          dialCode,
          phone,
          fullPhone,
          fullPhoneField: $('#cs-fullPhone').val()
        });
        
        // Log all form data
        const formData = {};
        form.serializeArray().forEach(function(item) {
          formData[item.name] = item.value;
        });
        
        debugLog('Complete form data', formData);
        
        // In debug mode, show a message instead of submitting
        if (DEBUG) {
          showDebugMessage('Form would be submitted with the data shown in console', 'success');
          return false;
        }
      });
      
      debugLog('Form submission handler initialized');
    } catch (error) {
      debugError('Failed to initialize form submission', error);
    }
  }
  
  // 4. Page URL Capture (Finsweet)
  function initPageUrlCapture() {
    debugLog('Initializing page URL capture');
    
    try {
      const SHOW_PAGE_URL_SELECTOR = '[fs-hacks-element="show-page-url"]';
      const PAGE_URL_INPUT_SELECTOR = '[fs-hacks-element="page-url-input"]';
      
      const pageUrl = document.querySelector(SHOW_PAGE_URL_SELECTOR);
      const pageUrlInput = document.querySelector(PAGE_URL_INPUT_SELECTOR);
      
      if (!pageUrl && !pageUrlInput) {
        debugLog('Page URL elements not found, skipping URL capture');
        return;
      }
      
      const url = location.href;
      
      if (pageUrlInput) {
        pageUrlInput.value = url;
        debugLog('Set page URL input', { selector: PAGE_URL_INPUT_SELECTOR, value: url });
      }
      
      if (pageUrl) {
        pageUrl.innerText = url;
        debugLog('Set page URL text', { selector: SHOW_PAGE_URL_SELECTOR, value: url });
      }
      
      debugLog('Page URL capture initialized');
    } catch (error) {
      debugError('Failed to initialize page URL capture', error);
    }
  }
  
  // 5. Form Validator (jQuery Validate)
  function initFormValidator() {
    debugLog('Initializing jQuery validate');
    
    try {
      // Check if jQuery validate is available
      if (typeof $.fn.validate === 'undefined') {
        debugLog('jQuery validate not found, skipping form validation initialization');
        return;
      }
      
      $("[data-validate-form='true']").each(function() {
        $(this).validate({
          errorPlacement: function(error, element) {
            error.appendTo(element.closest("[data-errorplace='true']"));
          },
          debug: DEBUG, // Don't submit in debug mode
          success: function(label, element) {
            debugLog('Field validated successfully', { 
              element: element.name || element.id, 
              value: element.value 
            });
          },
          invalidHandler: function(event, validator) {
            debugLog('Form validation failed', { 
              errors: validator.numberOfInvalids() 
            });
          },
          submitHandler: function(form) {
            debugLog('Form passed validation, preparing to submit');
            
            // If in debug mode, prevent submission
            if (DEBUG) {
              debugLog('Submission prevented in debug mode');
              showDebugMessage('Form is valid and would be submitted', 'success');
              return false;
            }
            
            form.submit();
          }
        });
        
        debugLog('jQuery validate initialized for form', { 
          id: this.id || 'unnamed form' 
        });
      });
    } catch (error) {
      debugError('Failed to initialize jQuery validate', error);
    }
  }
  
  // Debug helpers
  function addDebugPanel() {
    // Create debug panel
    const panel = document.createElement('div');
    panel.id = 'form-debug-panel';
    panel.style.cssText = `
      position: fixed;
      bottom: 10px;
      right: 10px;
      width: 300px;
      max-height: 200px;
      overflow: auto;
      background: rgba(0,0,0,0.85);
      color: #00ff00;
      font-family: monospace;
      font-size: 12px;
      padding: 10px;
      border-radius: 5px;
      z-index: 9999;
      display: none;
    `;
    
    // Create toggle button
    const button = document.createElement('button');
    button.textContent = 'Debug Panel';
    button.style.cssText = `
      position: fixed;
      bottom: 10px;
      right: 10px;
      z-index: 10000;
      padding: 5px;
      background: #333;
      color: #fff;
      border: none;
      border-radius: 3px;
      font-size: 12px;
    `;
    
    // Add to document
    document.body.appendChild(panel);
    document.body.appendChild(button);
    
    // Toggle panel on button click
    button.addEventListener('click', function() {
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    });
    
    // Override console.log
    const originalLog = console.log;
    const originalError = console.error;
    
    console.log = function() {
      originalLog.apply(console, arguments);
      
      // Only add debug messages to panel
      const firstArg = arguments[0];
      if (typeof firstArg === 'string' && firstArg.includes('[DEBUG]')) {
        addLogToPanel(arguments[0], 'log');
      }
    };
    
    console.error = function() {
      originalError.apply(console, arguments);
      
      // Only add error messages to panel
      const firstArg = arguments[0];
      if (typeof firstArg === 'string' && firstArg.includes('[ERROR]')) {
        addLogToPanel(arguments[0], 'error');
      }
    };
    
    function addLogToPanel(message, type) {
      const entry = document.createElement('div');
      entry.style.borderBottom = '1px solid #333';
      entry.style.padding = '3px 0';
      entry.style.color = type === 'error' ? '#ff5555' : '#00ff00';
      entry.textContent = message;
      panel.appendChild(entry);
      panel.scrollTop = panel.scrollHeight;
    }
    
    debugLog('Debug panel added');
  }
  
  function showDebugMessage(message, type) {
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `debug-message debug-${type}`;
    messageElement.style.cssText = `
      padding: 10px;
      margin: 10px 0;
      border-radius: 4px;
      background-color: ${type === 'success' ? '#d4edda' : '#f8d7da'};
      color: ${type === 'success' ? '#155724' : '#721c24'};
      border: 1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'};
    `;
    messageElement.textContent = `DEBUG MODE: ${message}`;
    
    // Find form or create container
    const form = document.querySelector('#cs_gated_form');
    
    if (form) {
      // Remove any existing messages
      const existing = form.querySelectorAll('.debug-message');
      existing.forEach(el => el.remove());
      
      // Add new message
      form.appendChild(messageElement);
    } else {
      // If form not found, add to body
      document.body.appendChild(messageElement);
    }
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      messageElement.remove();
    }, 5000);
  }
})();