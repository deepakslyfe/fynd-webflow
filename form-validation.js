$(document).ready(function() {
  var input1 = document.querySelector("#phone-cs"),
    dialCode1 = document.querySelector("#cs-dialCode"),
     errorMsg1 = document.querySelector("#cs-error-msg"),
      validMsg1 = document.querySelector("#cs-valid-msg");
  
  var iti = intlTelInput(input1, {
    initialCountry: "in",
    placeholderNumberType: 'FIXED_LINE',
  });
   var input = document.querySelector("#phone"),
      dialCode = document.querySelector(".dialCode"),
      errorMsg = document.querySelector("#error-msg"),
      validMsg = document.querySelector("#valid-msg");
  
    var iti = intlTelInput(input, {
      initialCountry: "auto",
      strictMode: true,
      geoIpLookup: (callback) => {
        fetch("https://ipapi.co/json")
          .then((res) => res.json())
          .then((data) => callback(data.country_code))
          .catch(() => callback("in"));
      },
    });
  
  var updateInputValue = function (event) {
         dialCode.value = "+" + iti.getSelectedCountryData().dialCode;
  };
  input.addEventListener('input', updateInputValue, false);
  input.addEventListener('countrychange', updateInputValue, false);
  
  var errorMap = ["Please enter the valid phone number", "Invalid country code", "Too short", "Too long", "Invalid number"];
  
  var reset = function() {
    input.classList.remove("error");
    errorMsg.innerHTML = "";
    errorMsg.classList.add("errorhide");
    validMsg.classList.add("errorhide");
  };
  
  // Regular expression for validating phone numbers
  var phoneRegex = /^(?:[0-9]●?){6,14}[0-9]$/;
  
  // Function to validate phone number
  function isValidPhoneNumber(phoneNumber) {
    return phoneRegex.test(phoneNumber);
  }
  
  input.addEventListener('blur', function() {
    reset();
    var phoneNumber = $(this).val();
    if (phoneNumber && !isValidPhoneNumber(phoneNumber)) {
      $(this).addClass('invalid');
    } else {
      $(this).removeClass('invalid');
    }
    if (input.value.trim()) {
      if (iti.isValidNumber()) {
        validMsg.classList.remove("errorhide");
      } else {
        input.classList.add("error");
        var errorCode = iti.getValidationError();
        errorMsg.innerHTML = errorMap[errorCode];
        errorMsg.classList.remove("errorhide");
      }
    }
  });
  
  input.addEventListener('change', reset);
  input.addEventListener('keyup', reset);
  
  $(':input[required]').blur(function() {
      if ($(this).val() === '') {
        $(this).addClass('invalid');
      } else {
        $(this).removeClass('invalid');
      }
    });
    $('#btnSubmit').click(function() {
      var requiredFields = $(':input[required]');
      var isValid = true;
      requiredFields.each(function() {
        if ($(this).val() === '') {
          $(this).addClass('invalid');
          isValid = false;
        } else {
          $(this).removeClass('invalid');
        }
      });
    });
  });
  // International phone number ends

  // combine phone number parts
  $(function() {
    // Trigger when the form is submitted
    $("#contact-form").on("submit", function(e) {
      // Combine the phone parts into the #fullPhone input
      // This will be passed through in the form submit
      $("#fullPhone").val(
        `${$("#dialCode").val()} ${$("#phone2").val()}`
      );    
      // DEBUG - REMOVE THIS IN YOUR CODE
      // Write the results to the console so we can see if it worked
      console.log(JSON.stringify(
        $("form").serializeArray()
      ));
    });
  });

  // form validation
  $("[data-validate-form='true']").each(function () {
    $(this).validate({
      errorPlacement: function (error, element) {
        error.appendTo(element.closest("[data-errorplace='true']"));
      },
    });
  });

  // page url 
  document.addEventListener('DOMContentLoaded', function () {
    // declare constant selectors
    const FORM_SELECTOR = '[fs-hacks-element="form"]';
    const NAME_INPUT_SELECTOR = '[fs-hacks-element="name-input"]';
    const MESSAGE_SELECTOR = '[fs-hacks-element="custom-message"]';
    const form = document.querySelector(FORM_SELECTOR);
    
      // early return
      if (!form) return;
      const nameInput = form.querySelector(NAME_INPUT_SELECTOR);
      const messageDiv = document.querySelector(MESSAGE_SELECTOR);
    
      if (!nameInput || !messageDiv) return;
    
      // when form is submitted
      nameInput.addEventListener('input', function () {
        const nameValue = nameInput.value;
    
        if (nameValue && nameValue !== '') {
          messageDiv.innerText = `Grab a cup of tea ${nameValue}, because your ebook will be landing in your device in just 5 second. Get ready to dive in!`;
        } else {
          messageDiv.innerText = 'Thank you! Your submission has been received!';
        }
      });
    });

    // page url
    document.addEventListener('DOMContentLoaded', function () {
        const SHOW_PAGE_URL_SELECTOR = '[fs-hacks-element="show-page-url"]';
        const PAGE_URL_INPUT_SELECTOR = '[fs-hacks-element="page-url-input"]';
        const pageUrl = document.querySelector(SHOW_PAGE_URL_SELECTOR);
        const pageUrlInput = document.querySelector(PAGE_URL_INPUT_SELECTOR);
      
        if (!pageUrl || !pageUrlInput) return;
        const url = location.href;
      
        pageUrlInput.value = url;
      
        pageUrl.innerText = url;
      });


/**
 * Debug script for multiple international phone inputs on the same page
 * Prevents form submission and adds detailed logging
 */
$(document).ready(function() {
  console.log("✓ DEBUG MODE ACTIVE: Form submission will be blocked for testing");
  
  // Create a debug panel
  createDebugPanel();
  
  // Initialize first phone input (#phone-cs)
  debugLog("Initializing first phone input (#phone-cs)");
  var input1 = document.querySelector("#phone-cs");
  var dialCode1 = document.querySelector("#cs-dialCode");
  var errorMsg1 = document.querySelector("#cs-error-msg");
  var validMsg1 = document.querySelector("#cs-valid-msg");
  
  if (input1) {
    debugLog("Found #phone-cs input");
    
    // Check if already initialized
    if (input1.closest('.iti')) {
      debugLog("Warning: #phone-cs already has intlTelInput initialized, destroying it first", "warning");
      try {
        var existingInstance = window.intlTelInputGlobals.getInstance(input1);
        if (existingInstance) {
          existingInstance.destroy();
          debugLog("Successfully destroyed existing instance on #phone-cs");
        }
      } catch(e) {
        debugLog("Error destroying existing instance: " + e.message, "error");
      }
    }
    
    // Initialize with a unique name to avoid conflicts
    var iti1 = intlTelInput(input1, {
      initialCountry: "in",
      placeholderNumberType: 'FIXED_LINE',
      separateDialCode: true,
      utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js"
    });
    
    debugLog("Initialized intlTelInput on #phone-cs");
    
    // Store instance for future reference
    window.iti1 = iti1;
    
    // Set up event handlers for first phone input
    var updateInputValue1 = function(event) {
      if (dialCode1) {
        var countryData = iti1.getSelectedCountryData();
        dialCode1.value = "+" + countryData.dialCode;
        debugLog(`Updated #cs-dialCode value to: ${dialCode1.value}`);
      }
    };
    
    input1.addEventListener('input', function(event) {
      debugLog(`Input event on #phone-cs: ${input1.value}`);
      updateInputValue1(event);
    }, false);
    
    input1.addEventListener('countrychange', function(event) {
      debugLog(`Country change event on #phone-cs`);
      updateInputValue1(event);
    }, false);
    
    // Set initial value
    updateInputValue1({ type: 'initial' });
  } else {
    debugLog("Warning: #phone-cs input not found", "warning");
  }
  
  // Initialize second phone input (#phone)
  debugLog("Initializing second phone input (#phone)");
  var input2 = document.querySelector("#phone");
  var dialCode2 = document.querySelector(".dialCode");
  var errorMsg2 = document.querySelector("#error-msg");
  var validMsg2 = document.querySelector("#valid-msg");
  
  if (input2) {
    debugLog("Found #phone input");
    
    // Check if already initialized
    if (input2.closest('.iti')) {
      debugLog("Warning: #phone already has intlTelInput initialized, destroying it first", "warning");
      try {
        var existingInstance = window.intlTelInputGlobals.getInstance(input2);
        if (existingInstance) {
          existingInstance.destroy();
          debugLog("Successfully destroyed existing instance on #phone");
        }
      } catch(e) {
        debugLog("Error destroying existing instance: " + e.message, "error");
      }
    }
    
    // Initialize with a unique name to avoid conflicts
    var iti2 = intlTelInput(input2, {
      initialCountry: "auto",
      strictMode: true,
      separateDialCode: true,
      utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js",
      geoIpLookup: function(callback) {
        debugLog("Starting GeoIP lookup for #phone");
        fetch("https://ipapi.co/json")
          .then(function(res) {
            return res.json();
          })
          .then(function(data) {
            debugLog(`GeoIP lookup success: ${data.country_code}`);
            callback(data.country_code);
          })
          .catch(function(error) {
            debugLog("GeoIP lookup failed, defaulting to 'in'", "warning");
            callback("in");
          });
      },
    });
    
    debugLog("Initialized intlTelInput on #phone");
    
    // Store instance for future reference
    window.iti2 = iti2;
    
    // Set up event handlers for second phone input
    var updateInputValue2 = function(event) {
      if (dialCode2) {
        var countryData = iti2.getSelectedCountryData();
        dialCode2.value = "+" + countryData.dialCode;
        debugLog(`Updated .dialCode value to: ${dialCode2.value}`);
      }
    };
    
    input2.addEventListener('input', function(event) {
      debugLog(`Input event on #phone: ${input2.value}`);
      updateInputValue2(event);
    }, false);
    
    input2.addEventListener('countrychange', function(event) {
      debugLog(`Country change event on #phone`);
      updateInputValue2(event);
    }, false);
    
    // Set initial value
    updateInputValue2({ type: 'initial' });
    
    // Error handling for second phone
    var errorMap = ["Please enter the valid phone number", "Invalid country code", "Too short", "Too long", "Invalid number"];
    
    var reset = function() {
      input2.classList.remove("error");
      if (errorMsg2) {
        errorMsg2.innerHTML = "";
        errorMsg2.classList.add("errorhide");
      }
      if (validMsg2) {
        validMsg2.classList.add("errorhide");
      }
      debugLog("Reset validation state for #phone");
    };
    
    // Regular expression for validating phone numbers
    var phoneRegex = /^(?:[0-9]●?){6,14}[0-9]$/;
    
    // Function to validate phone number
    function isValidPhoneNumber(phoneNumber) {
      var isValid = phoneRegex.test(phoneNumber);
      debugLog(`Regex validation for ${phoneNumber}: ${isValid ? 'Valid' : 'Invalid'}`);
      return isValid;
    }
    
    input2.addEventListener('blur', function() {
      debugLog("Blur event on #phone");
      reset();
      var phoneNumber = $(this).val();
      if (phoneNumber && !isValidPhoneNumber(phoneNumber)) {
        $(this).addClass('invalid');
        debugLog("Phone number failed regex validation", "warning");
      } else {
        $(this).removeClass('invalid');
      }
      if (input2.value.trim()) {
        var isValid = iti2.isValidNumber();
        debugLog(`intlTelInput validation: ${isValid ? 'Valid' : 'Invalid'}`);
        
        if (isValid) {
          if (validMsg2) {
            validMsg2.classList.remove("errorhide");
            debugLog("Showing valid message");
          }
        } else {
          input2.classList.add("error");
          if (errorMsg2) {
            var errorCode = iti2.getValidationError();
            errorMsg2.innerHTML = errorMap[errorCode];
            errorMsg2.classList.remove("errorhide");
            debugLog(`Showing error message: ${errorMap[errorCode]}`, "warning");
          }
        }
      }
    });
    
    input2.addEventListener('change', reset);
    input2.addEventListener('keyup', reset);
  } else {
    debugLog("Warning: #phone input not found", "warning");
  }
  
  // Form submission handling - FIRST FORM (CS Gated Form)
  var csForm = document.getElementById("wf-form-CS-Gated-Form");
  if (csForm) {
    debugLog("Found CS Gated Form (#wf-form-CS-Gated-Form)");
    
    // Add form submission handler
    $(csForm).on("submit", function(e) {
      e.preventDefault(); // Block submission for testing
      debugLog("Form submission blocked for debugging", "important");
      
      // Combine phone parts for first form
      if (dialCode1 && input1) {
        var fullPhone = `${dialCode1.value} ${input1.value}`;
        var fullPhoneInput = document.querySelector("#cs-fullPhone");
        
        if (fullPhoneInput) {
          fullPhoneInput.value = fullPhone;
          debugLog(`Combined phone value: ${fullPhone}`);
        } else {
          debugLog("Warning: #cs-fullPhone input not found", "warning");
        }
      }
      
      // Debug form data
      var formData = {};
      $(this).serializeArray().forEach(function(item) {
        formData[item.name] = item.value;
      });
      
      debugLog("Form data that would be submitted:", "info", formData);
      
      // Show a visual confirmation
      showSubmitNotification(this);
      
      return false;
    });
  } else {
    debugLog("Warning: CS Gated Form not found", "warning");
  }
  
  // Form submission handling - SECOND FORM (Contact form)
  var contactForm = document.getElementById("contact-form");
  if (contactForm) {
    debugLog("Found Contact Form (#contact-form)");
    
    // Add form submission handler
    $(contactForm).on("submit", function(e) {
      e.preventDefault(); // Block submission for testing
      debugLog("Form submission blocked for debugging", "important");
      
      // Combine phone parts for second form
      if (dialCode2) {
        var phone2Input = document.querySelector("#phone2"); // Note: different ID
        if (phone2Input) {
          var fullPhone = `${dialCode2.value} ${phone2Input.value}`;
          var fullPhoneInput = document.querySelector("#fullPhone");
          
          if (fullPhoneInput) {
            fullPhoneInput.value = fullPhone;
            debugLog(`Combined phone value: ${fullPhone}`);
          } else {
            debugLog("Warning: #fullPhone input not found", "warning");
          }
        } else {
          debugLog("Warning: #phone2 input not found", "warning");
        }
      }
      
      // Debug form data
      var formData = {};
      $(this).serializeArray().forEach(function(item) {
        formData[item.name] = item.value;
      });
      
      debugLog("Form data that would be submitted:", "info", formData);
      
      // Show a visual confirmation
      showSubmitNotification(this);
      
      return false;
    });
  } else {
    debugLog("Note: Contact Form not found (may not be on this page)");
  }
  
  // Field validation
  $(':input[required]').blur(function() {
    var fieldName = $(this).attr('name') || $(this).attr('id');
    var isEmpty = $(this).val() === '';
    
    debugLog(`Required field '${fieldName}' validation: ${isEmpty ? 'Empty' : 'Has value'}`);
    
    if (isEmpty) {
      $(this).addClass('invalid');
    } else {
      $(this).removeClass('invalid');
    }
  });
  
  // Submit button handling
  $('button[type="submit"]').click(function() {
    var formId = $(this).closest('form').attr('id');
    debugLog(`Submit button clicked for form #${formId}`);
    
    var requiredFields = $(this).closest('form').find(':input[required]');
    var isValid = true;
    var invalidFields = [];
    
    requiredFields.each(function() {
      var fieldName = $(this).attr('name') || $(this).attr('id');
      var isEmpty = $(this).val() === '';
      
      debugLog(`Validating required field '${fieldName}': ${isEmpty ? 'Empty' : 'Has value'}`);
      
      if (isEmpty) {
        $(this).addClass('invalid');
        isValid = false;
        invalidFields.push(fieldName);
      } else {
        $(this).removeClass('invalid');
      }
    });
    
    if (!isValid) {
      debugLog(`Form has invalid fields: ${invalidFields.join(', ')}`, "warning");
    } else {
      debugLog("All required fields are valid");
    }
  });
  
  // Add test/debug buttons
  addDebugButtons();
});

// Helper functions for debugging

// Create debug panel
function createDebugPanel() {
  // Add CSS for debug elements
  $("<style>")
    .prop("type", "text/css")
    .html(`
      #debug-panel {
        position: fixed;
        bottom: 10px;
        right: 10px;
        width: 350px;
        max-height: 300px;
        background: rgba(0,0,0,0.85);
        color: #00ff00;
        font-family: monospace;
        font-size: 12px;
        padding: 10px;
        border-radius: 5px;
        z-index: 9999;
        overflow: auto;
        display: none;
      }
      #debug-toggle {
        position: fixed;
        bottom: 10px;
        right: 10px;
        z-index: 10000;
        padding: 5px 10px;
        background: #333;
        color: #fff;
        border: none;
        border-radius: 3px;
        font-size: 12px;
        cursor: pointer;
      }
      .debug-buttons {
        position: fixed;
        right: 10px;
        bottom: 50px;
        display: flex;
        flex-direction: column;
        gap: 5px;
        z-index: 10000;
      }
      .debug-button {
        padding: 5px;
        background: #333;
        color: #fff;
        border: none;
        border-radius: 3px;
        font-size: 12px;
        cursor: pointer;
        text-align: left;
      }
      .debug-message {
        padding: 10px;
        margin: 10px 0;
        border-radius: 4px;
        text-align: center;
        font-weight: bold;
      }
      .debug-success {
        background-color: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
      }
      .debug-log {
        border-bottom: 1px solid #333;
        padding: 3px 0;
      }
      .debug-log.error {
        color: #ff5555;
      }
      .debug-log.warning {
        color: #ffaa55;
      }
      .debug-log.important {
        color: #ffffff;
        font-weight: bold;
      }
      .debug-log.info {
        color: #55aaff;
      }
      .errorhide {
        display: none;
      }
      input.invalid {
        border-color: red !important;
      }
    `)
    .appendTo("head");
  
  // Create debug panel
  var panel = $("<div>")
    .attr("id", "debug-panel")
    .appendTo("body");
  
  // Create toggle button
  var button = $("<button>")
    .attr("id", "debug-toggle")
    .text("Show Debug Console")
    .appendTo("body");
  
  // Toggle panel on button click
  button.click(function() {
    var panel = $("#debug-panel");
    panel.toggle();
    $(this).text(panel.is(":visible") ? "Hide Debug Console" : "Show Debug Console");
  });
}

// Add debug message
function debugLog(message, level, data) {
  level = level || "debug";
  
  var now = new Date();
  var timestamp = now.getHours().toString().padStart(2, '0') + ":" +
                  now.getMinutes().toString().padStart(2, '0') + ":" +
                  now.getSeconds().toString().padStart(2, '0');
  
  var logMessage = `[${timestamp}] ${message}`;
  
  // Log to console
  if (data) {
    console.log(logMessage, data);
  } else {
    console.log(logMessage);
  }
  
  // Add to debug panel
  var panel = $("#debug-panel");
  var entry = $("<div>")
    .addClass("debug-log")
    .addClass(level)
    .text(logMessage);
  
  // Add data if provided
  if (data) {
    var dataStr = typeof data === 'object' ? JSON.stringify(data, null, 2) : data;
    $("<pre>")
      .text(dataStr)
      .css({
        "margin": "3px 0 3px 10px",
        "font-size": "11px",
        "color": "#aaaaaa"
      })
      .appendTo(entry);
  }
  
  panel.append(entry);
  panel.scrollTop(panel[0].scrollHeight);
}

// Show notification of form submission
function showSubmitNotification(form) {
  // Remove any existing notifications
  $(".debug-message").remove();
  
  // Create new notification
  var message = $("<div>")
    .addClass("debug-message debug-success")
    .html("DEBUG MODE: Form submission prevented.<br>Check the debug console for form data.")
    .appendTo(form);
  
  // Scroll to the message
  $('html, body').animate({
    scrollTop: message.offset().top - 100
  }, 500);
  
  // Remove after 5 seconds
  setTimeout(function() {
    message.fadeOut(function() {
      $(this).remove();
    });
  }, 5000);
}

// Add debug buttons
function addDebugButtons() {
  var buttonContainer = $("<div>")
    .addClass("debug-buttons")
    .appendTo("body");
  
  // Button to test first phone input
  $("<button>")
    .addClass("debug-button")
    .text("Test CS Form Phone")
    .click(function() {
      var input = document.querySelector("#phone-cs");
      if (input && window.iti1) {
        debugLog("Testing CS Form Phone Input");
        var countryData = window.iti1.getSelectedCountryData();
        debugLog("Current country data:", "info", countryData);
        
        // Test changing to a different country
        var testCountry = countryData.iso2 === "us" ? "gb" : "us";
        window.iti1.setCountry(testCountry);
        debugLog(`Changed country to ${testCountry}`);
      } else {
        debugLog("Cannot test: Input or iti1 not found", "error");
      }
    })
    .appendTo(buttonContainer);
  
  // Button to test second phone input
  $("<button>")
    .addClass("debug-button")
    .text("Test Contact Form Phone")
    .click(function() {
      var input = document.querySelector("#phone");
      if (input && window.iti2) {
        debugLog("Testing Contact Form Phone Input");
        var countryData = window.iti2.getSelectedCountryData();
        debugLog("Current country data:", "info", countryData);
        
        // Test changing to a different country
        var testCountry = countryData.iso2 === "us" ? "gb" : "us";
        window.iti2.setCountry(testCountry);
        debugLog(`Changed country to ${testCountry}`);
      } else {
        debugLog("Cannot test: Input or iti2 not found", "error");
      }
    })
    .appendTo(buttonContainer);
  
  // Button to dump form data
  $("<button>")
    .addClass("debug-button")
    .text("Show All Form Data")
    .click(function() {
      debugLog("Collecting form data from all forms");
      
      $("form").each(function() {
        var formId = $(this).attr("id") || "unnamed-form";
        var formData = {};
        
        $(this).find("input, select, textarea").each(function() {
          var name = $(this).attr("name") || $(this).attr("id");
          if (name) {
            formData[name] = $(this).val();
          }
        });
        
        debugLog(`Form #${formId} data:`, "info", formData);
      });
    })
    .appendTo(buttonContainer);
  
  // Button to check for duplicate IDs
  $("<button>")
    .addClass("debug-button")
    .text("Check for Duplicate IDs")
    .click(function() {
      debugLog("Checking for duplicate IDs");
      
      var idMap = {};
      var duplicates = [];
      
      $("[id]").each(function() {
        var id = $(this).attr("id");
        if (idMap[id]) {
          duplicates.push(id);
        } else {
          idMap[id] = true;
        }
      });
      
      if (duplicates.length > 0) {
        debugLog(`Found ${duplicates.length} duplicate IDs:`, "warning", duplicates);
      } else {
        debugLog("No duplicate IDs found", "info");
      }
    })
    .appendTo(buttonContainer);
  
  // Show debug panel on start
  $("#debug-toggle").click();
}