# Form Validation 

## International phone number with country code
```html
<!--Country phone no code-->
 <script src="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.12/js/intlTelInput.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.12/js/utils.min.js"></script>
<!--Jquery form validation code-->
<script src="https://code.jquery.com/jquery-3.7.1.min.js" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.19.3/jquery.validate.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.19.3/additional-methods.min.js"></script>

<script>
$(document).ready(function() {
var input = document.querySelector("#Phone-cs"),
    dialCode = document.querySelector("#cs-dialCode"),
    errorMsg = document.querySelector("#cs-error-msg"),
    validMsg = document.querySelector("#cs-valid-msg");

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
</script>
 
 <!--International phone number Dial code + Mobile no combined-->
<script>
    $(function() {
    // Trigger when the form is submitted
    $("#cs_gated_form").on("submit", function(e) {
        // Combine the phone parts into the #fullPhone input
        // This will be passed through in the form submit
        $("#cs-fullPhone").val(
            `${$("#cs-dialCode").val()} ${$("#Phone-cs").val()}`
        );    
    });
});
</script>

<script>
  // form validation
  $("[data-validate-form='true']").each(function () {
    $(this).validate({
      errorPlacement: function (error, element) {
        error.appendTo(element.closest("[data-errorplace='true']"));
      },
    });
  });
</script>

<!--Finsweet- Dynamically submit page url through a Webflow web form submission-->
<script>
// when the DOM is ready
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
</script>
```