var allowance = 1047.50;
//possible pension pay of 7% ? 
$(".calculate-salary").click(function(){
  var rate = $("#hourly-rate-text").val();
  if ($.trim(rate) === '') {
    $('#totalPay').text("Hourly Rate Not Given");
  }else{
    rate = parseFloat(rate);
    var fridayOTPay = $("#fridayOT-worked-text").val() * (rate * 1.33);
    var saturdayOTPay = $("#saturdayOT-worked-text").val() * (rate * 1.50);
    var sundayOTPay = $("#sundayOT-worked-text").val() * (rate * 2);
    var extraPay = parseFloat($("#extra-pay-text").val()) || 0;

    var preTaxPay = ((260/12) * (rate) * 9) + fridayOTPay + saturdayOTPay + sundayOTPay + extraPay;
    var tax = (preTaxPay - allowance) * 0.20;
    var nationalInsurance = (preTaxPay - allowance) * 0.08;
    var postTax = preTaxPay - tax - nationalInsurance;

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
      $('.show-salary-container').css("height", "300px");
    }

    animateValue(preTaxPayObj, 0, preTaxPay, 2000);
    animateValue(nIDeductObj, 0, nationalInsurance, 2000);
    animateValue(taxDeductObj, 0, tax, 2000);
    animateValue(totalPayObj, 0, postTax, 2000);
  }  
})

function animateValue(obj, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    let value = progress * (end - start) + start;

    if (value === Math.floor(value)){
      obj.innerHTML = "0";
    }else{
      obj.innerHTML = "£" + (Math.round(value * 100) / 100).toFixed(2);
    }
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

$(".backButton").click(function(){
  $('.show-salary-container').fadeOut("slow"); // make it disappear
});

