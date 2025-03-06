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