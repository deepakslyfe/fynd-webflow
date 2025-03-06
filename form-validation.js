/**
 * Combined Form Validation & Phone Input Script
 * - Handles international phone input and validation
 * - Includes form validation for required fields
 * - Combines phone parts for submission
 * - Captures page URL
 */

$(document).ready(function() {
  // Debug mode (set to false for production)
  const DEBUG = true;
  
  // Debug logger
  function debugLog(message) {
    if (DEBUG) console.log(`[DEBUG] ${message}`);
  }
  
  debugLog("Form validation initialized");
  
  // ----- PHONE VALIDATION SECTION -----
  
  // First phone input (#phone-cs in CS-Gated-Form)
  var input1 = document.querySelector("#phone-cs"),
      dialCode1 = document.querySelector("#cs-dialCode"),
      errorMsg1 = document.querySelector("#cs-error-msg"),
      validMsg1 = document.querySelector("#cs-valid-msg");
  
  // Second phone input (#phone in contact-form if it exists)
  var input2 = document.querySelector("#phone"),
      dialCode2 = document.querySelector(".dialCode"),
      errorMsg2 = document.querySelector("#error-msg"),
      validMsg2 = document.querySelector("#valid-msg");
  
  // Initialize first phone input if it exists
  if (input1) {
    debugLog("Initializing first phone input (#phone-cs)");
    var iti1 = intlTelInput(input1, {
      initialCountry: "in",
      placeholderNumberType: 'FIXED_LINE',
      utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js"
    });
    
    // Set up first phone event handlers
    function updateDialCode1() {
      if (dialCode1) {
        dialCode1.value = "+" + iti1.getSelectedCountryData().dialCode;
        debugLog(`Updated cs-dialCode to: ${dialCode1.value}`);
      }
    }
    
    input1.addEventListener('input', function(event) {
      // Restrict input to numbers only
      this.value = this.value.replace(/[^\d]/g, '');
      updateDialCode1();
    }, false);
    
    input1.addEventListener('countrychange', updateDialCode1, false);
    
    // Handle validation for first phone
    input1.addEventListener('blur', function() {
      validatePhone(input1, iti1, errorMsg1, validMsg1);
    });
    
    // Set initial dial code
    updateDialCode1();
  }
  
  // Initialize second phone input if it exists
  if (input2) {
    debugLog("Initializing second phone input (#phone)");
    var iti2 = intlTelInput(input2, {
      initialCountry: "auto",
      strictMode: true,
      utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js",
      geoIpLookup: (callback) => {
        fetch("https://ipapi.co/json")
          .then((res) => res.json())
          .then((data) => callback(data.country_code))
          .catch(() => callback("in"));
      },
    });
    
    // Set up second phone event handlers
    function updateDialCode2() {
      if (dialCode2) {
        dialCode2.value = "+" + iti2.getSelectedCountryData().dialCode;
        debugLog(`Updated dialCode to: ${dialCode2.value}`);
      }
    }
    
    input2.addEventListener('input', function(event) {
      // Restrict input to numbers only
      this.value = this.value.replace(/[^\d]/g, '');
      updateDialCode2();
    }, false);
    
    input2.addEventListener('countrychange', updateDialCode2, false);
    
    // Handle validation for second phone
    input2.addEventListener('blur', function() {
      validatePhone(input2, iti2, errorMsg2, validMsg2);
    });
    
    // Set initial dial code
    updateDialCode2();
  }
  
  // Common validation function for phone inputs
  function validatePhone(input, iti, errorMsg, validMsg) {
    // Reset validation state
    resetValidation(input, errorMsg, validMsg);
    
    if (!input.value.trim()) {
      return;
    }
    
    // Check for non-numeric characters (additional check)
    if (/[^\d]/.test(input.value)) {
      input.classList.add("error");
      input.classList.add("invalid");
      if (errorMsg) {
        errorMsg.innerHTML = "Only numbers allowed";
        errorMsg.classList.remove("errorhide");
      }
      debugLog(`Phone validation failed: non-numeric characters found`);
      return;
    }
    
    // Validate using intlTelInput
    if (iti.isValidNumber()) {
      input.classList.remove("invalid");
      if (validMsg) {
        validMsg.classList.remove("errorhide");
      }
      debugLog(`Phone validation passed`);
    } else {
      input.classList.add("error");
      input.classList.add("invalid");
      
      if (errorMsg) {
        const errorMap = [
          "Please enter a valid phone number", 
          "Invalid country code", 
          "Phone number too short", 
          "Phone number too long", 
          "Invalid phone number"
        ];
        const errorCode = iti.getValidationError();
        errorMsg.innerHTML = errorMap[errorCode];
        errorMsg.classList.remove("errorhide");
        debugLog(`Phone validation failed: ${errorMap[errorCode]}`);
      }
    }
  }
  
  // Reset validation state
  function resetValidation(input, errorMsg, validMsg) {
    input.classList.remove("error");
    if (errorMsg) {
      errorMsg.innerHTML = "";
      errorMsg.classList.add("errorhide");
    }
    if (validMsg) {
      validMsg.classList.add("errorhide");
    }
  }
  
  // ----- FORM HANDLING SECTION -----
  
  // Block form submission during testing (remove this in production)
  if (DEBUG) {
    $("form").on("submit", function(e) {
      e.preventDefault();
      debugLog("Form submission blocked for testing");
      
      // Show what would have been submitted
      var formData = {};
      $(this).serializeArray().forEach(function(item) {
        formData[item.name] = item.value;
      });
      console.log("Form data:", formData);
      
      // For the CS form
      if (this.id === "wf-form-CS-Gated-Form" && dialCode1 && input1) {
        $("#cs-fullPhone").val(`${dialCode1.value} ${input1.value}`);
        debugLog(`Combined CS phone: ${$("#cs-fullPhone").val()}`);
      }
      
      // For the contact form
      if (this.id === "contact-form") {
        $("#fullPhone").val(`${dialCode2.value} ${$("#phone2").val()}`);
        debugLog(`Combined contact phone: ${$("#fullPhone").val()}`);
      }
      
      // Show success message
      const message = $("<div>")
        .css({
          "padding": "10px", 
          "margin": "10px 0", 
          "background": "#d4edda", 
          "color": "#155724", 
          "border-radius": "4px", 
          "text-align": "center"
        })
        .html("DEBUG MODE: Form would be submitted with the data shown in console")
        .prependTo(this);
      
      setTimeout(function() {
        message.fadeOut();
      }, 5000);
      
      return false;
    });
  } else {
    // Regular form submission handlers (for production)
    // Handle contact form phone combination
    $("#contact-form").on("submit", function() {
      $("#fullPhone").val(`${$("#dialCode").val()} ${$("#phone2").val()}`);
    });
    
    // Handle CS form phone combination
    $("#wf-form-CS-Gated-Form").on("submit", function() {
      $("#cs-fullPhone").val(`${$("#cs-dialCode").val()} ${$("#phone-cs").val()}`);
    });
  }
  
  // ----- VALIDATION SECTION -----
  
  // Form validation for required fields
  $(':input[required]').blur(function() {
    if ($(this).val() === '') {
      $(this).addClass('invalid');
      debugLog(`Required field validation failed: ${$(this).attr('name') || $(this).attr('id')}`);
    } else {
      $(this).removeClass('invalid');
    }
  });
  
  // Button click validation
  $('#btnSubmit, button[type="submit"]').click(function() {
    debugLog("Submit button clicked");
    
    var requiredFields = $(this).closest('form').find(':input[required]');
    var isValid = true;
    
    requiredFields.each(function() {
      if ($(this).val() === '') {
        $(this).addClass('invalid');
        isValid = false;
        debugLog(`Required field empty: ${$(this).attr('name') || $(this).attr('id')}`);
      } else {
        $(this).removeClass('invalid');
      }
    });
    
    // Also validate phone fields at submit time
    if (input1 && iti1 && $(this).closest('form').find(input1).length) {
      validatePhone(input1, iti1, errorMsg1, validMsg1);
      if (input1.classList.contains('error')) {
        isValid = false;
        debugLog("Phone validation failed at submit");
      }
    }
    
    if (input2 && iti2 && $(this).closest('form').find(input2).length) {
      validatePhone(input2, iti2, errorMsg2, validMsg2);
      if (input2.classList.contains('error')) {
        isValid = false;
        debugLog("Phone validation failed at submit");
      }
    }
    
    debugLog(`Form validation result: ${isValid ? 'Valid' : 'Invalid'}`);
    return isValid;
  });
  
  // Form validation with jQuery Validate (if available)
  if (typeof $.fn.validate !== 'undefined') {
    $("[data-validate-form='true']").each(function () {
      $(this).validate({
        errorPlacement: function (error, element) {
          error.appendTo(element.closest("[data-errorplace='true']"));
        },
      });
    });
    debugLog("jQuery Validate initialized");
  }
  
  // ----- PAGE URL CAPTURE SECTION -----
  
  // Capture page URL
  const SHOW_PAGE_URL_SELECTOR = '[fs-hacks-element="show-page-url"]';
  const PAGE_URL_INPUT_SELECTOR = '[fs-hacks-element="page-url-input"]';
  const pageUrl = document.querySelector(SHOW_PAGE_URL_SELECTOR);
  const pageUrlInput = document.querySelector(PAGE_URL_INPUT_SELECTOR);
  
  if (pageUrl || pageUrlInput) {
    const url = location.href;
    
    if (pageUrlInput) {
      pageUrlInput.value = url;
      debugLog(`Set page URL input: ${url}`);
    }
    
    if (pageUrl) {
      pageUrl.innerText = url;
      debugLog(`Set page URL text: ${url}`);
    }
  }
});

// Add styles for validation
document.addEventListener('DOMContentLoaded', function() {
  const style = document.createElement('style');
  style.textContent = `
    input.error, input.invalid {
      border-color: red !important;
      border-width: 1px !important;
    }
    .iti {
      width: 100%;
    }
    .errorhide {
      display: none;
    }
  `;
  document.head.appendChild(style);
});