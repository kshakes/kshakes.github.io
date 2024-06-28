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

    const formattedNumber = postTax.toLocaleString('en-GB', {
        style: 'currency',
        currency: 'GBP',
      });
    $('.show-salary-container').css('display', 'flex');
    $('#totalPay').text(formattedNumber + "pm"); 
  }  
})