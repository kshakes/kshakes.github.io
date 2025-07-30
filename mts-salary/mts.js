/* Do more in depth calculations for different tax brackets 
and salaries that dont fall into a tax bracket */

var allowance = 1047.50;
var nonNumericRegex = /[^0-9.]/;

var hasOvertime = false;
if (!hasOvertime){
  $('.overtime-container').hide();
}

$(".calculate-salary").click(function(){
  // When the calculate-salary button is clicked, grab the text or the placeholder
  var rate = $("#hourly-rate-text").val() || $("#hourly-rate-text").attr("placeholder");
  // If the user input is ont appropriate to process, 
  if (nonNumericRegex.test(rate) ||  $.trim(rate) === '' || $.trim(rate) === "0") {
    console.log("Hourly Rate Not Given");
    $('body').toggleClass("shake");
    setTimeout(function(){
      $('body').toggleClass("shake");
    }, 500);

    // If the users input is an appropriate input, process it
  }else{
    rate = parseFloat(rate);
    // Grab all the OT pay values and calculate the total pay
    var fridayOTPay = $("#fridayOT-worked-text").val() * (rate * 1.33);
    var saturdayOTPay = $("#saturdayOT-worked-text").val() * (rate * 1.50);
    var sundayOTPay = $("#sundayOT-worked-text").val() * (rate * 2);
    var extraPay = parseFloat($("#extra-pay-text").val()) || 0;
    var hoursWorkedPerDay = 8;

    var preTaxPay = ((260/12) * (rate) * hoursWorkedPerDay) + fridayOTPay + saturdayOTPay + sundayOTPay + extraPay;
    var tax = (preTaxPay - allowance) * 0.20;
    var nationalInsurance = (preTaxPay - allowance) * 0.08;
    var postTax = preTaxPay - tax - nationalInsurance;
    showUsersPay(preTaxPay, tax, nationalInsurance, postTax);
    
  }  
})

function animateValue(obj, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    let value = progress * (end - start) + start;

    if (value !== Math.floor(value)){
      obj.innerHTML = "£" + (Math.round(value * 100) / 100).toFixed(2);
    }
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

function showUsersPay(preTaxPay, tax, nationalInsurance, postTax){
  $('.show-salary-container').css('display', 'flex');
    const preTaxPayObj = document.getElementById("preTaxPay");
    const nIDeductObj = document.getElementById("nIDeduct");
    const taxDeductObj = document.getElementById("taxDeduct");
    const totalPayObj = document.getElementById("totalPay");
    const pensionContObj = document.getElementById("pension");

    var pensionText = $("#pension-text").val();
    if ($.trim(pensionText) === '' || $.trim(pensionText) === '0'){
      $('#pension-parent').hide("fast");
      $('.show-salary-container').css("height", "275px");
    }
    else{
      var pensionContribution = ($("#pension-text").val() / 100) * preTaxPay;
      postTax -= pensionContribution;
      $('#pension-parent').show();
      animateValue(pensionContObj, 0, pensionContribution, 2000);
      $('.show-salary-container').css("height", "325px");
    }
    if (nationalInsurance >= 100){
      $('.show-salary-container').css("width", "325px");
    }
    animateValue(preTaxPayObj, 0, preTaxPay, 2000);
    animateValue(nIDeductObj, 0, nationalInsurance, 2000);
    animateValue(taxDeductObj, 0, tax, 2000);
    animateValue(totalPayObj, 0, postTax, 2000);
}

$(".backButton").click(function(){
  $('.show-salary-container').fadeOut("slow"); // make it disappear
});

$('#has-overtime').click(function(){
  hasOvertime = !hasOvertime;
  if (hasOvertime === true){
    $('.overtime-container').css('display', 'flex');
    $('#has-overtime').hide();
  }
});

