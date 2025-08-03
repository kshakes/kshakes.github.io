/* Do more in depth calculations for different tax brackets 
and salaries that dont fall into a tax bracket */

// Fix issue where you re-enter data after checking a salary and it doesnt work
// Make it so it resets back to the start.


$(document).ready(function () {
    let netPay = 0; // Salary after tax is stored here so it can be accessed
    let budgetItems = [];
    let chart;

    var allowance = 1047.50;
    var nonNumericRegex = /[^0-9.]/;

    var hasOvertime = false;
    if (!hasOvertime){
      $('.overtime-container').hide();
    }

    $(".calculate-salary").click(function(){
      // When the calculate-salary button is clicked, grab the text or the placeholder
      var rate = $("#hourly-rate-text").val() || $("#hourly-rate-text").attr("placeholder");
      // If the user input is not appropriate to process,
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

        // Calculate the annual salary based on the rate and hours worked
        var preTaxPay = ((260/12) * (rate) * hoursWorkedPerDay) + fridayOTPay + saturdayOTPay + sundayOTPay + extraPay;
        var tax = (preTaxPay - allowance) * 0.20;
        var nationalInsurance = (preTaxPay - allowance) * 0.08;
        netPay = preTaxPay - tax - nationalInsurance;

        // If the user doesn't enter any overtime, hide the overtime container
        if (fridayOTPay === 0 && saturdayOTPay === 0 && sundayOTPay === 0){
          hasOvertime = false;
          $('.overtime-container').hide();
          $('#has-overtime').show();
        }

        showUsersPay(preTaxPay, tax, nationalInsurance, netPay);
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

    function showUsersPay(preTaxPay, tax, nationalInsurance, netPay){
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
          netPay -= pensionContribution;
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
        animateValue(totalPayObj, 0, netPay, 2000);
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

    // Show budget planner
    $(".budgetButton").on("click", function () {
        $(".show-salary-container").hide();
        $("#budget-container").show();
        renderChart();
        updateRemainingBudget();
    });

    // Render ApexCharts Donut Chart
    function renderChart() {
    const spent = budgetItems.reduce((sum, item) => sum + item.amount, 0);
    const remaining = netPay - spent; // Prevent negative

    const series = [remaining, ...budgetItems.map(item => item.amount)];
    const labels = ["Remaining", ...budgetItems.map(item => item.category)];

    if (chart) {
        chart.updateSeries(series);
        chart.updateOptions({ labels: labels });
        return;
    }

    chart = new ApexCharts(document.querySelector("#budget-chart"), {
        chart: {
            type: 'donut',
            foreColor: '#fff'
        },
        series: series,
        labels: labels,
        colors: ['#00E396', '#FEB019', '#FF4560', '#775DD0', '#008FFB', '#FF66C3'],
        plotOptions: {
            pie: {
                donut: {
                    labels: {
                        show: true,
                        value: {
                          formatter: function (val) {
                            return "£" + parseFloat(val).toFixed(2);
                          }
                        },
                        total: {
                          show: true,
                          label: 'Net Pay',
                          formatter: () => `£${netPay.toFixed(2)}`
                        }
                    }
                }
            }
        },
        legend: { show: false }
      });

      chart.render();
  }


    // Update Remaining Budget
  function updateRemainingBudget() {
    const spent = budgetItems.reduce((sum, item) => sum + item.amount, 0);
    const remaining = Math.max(netPay - spent, 0);
    $("#remaining-budget").text(`Remaining Budget: £${remaining.toFixed(2)}`);
    renderChart(); // Update the chart with new data
    renderLegend();
  }


    // Render Legend with Edit/Delete options
    function renderLegend() {
        const legend = $("#budget-legend");
        legend.empty();
        budgetItems.forEach((item, index) => {
            const li = $(`
                <li>
                    ${item.category}: £${item.amount.toFixed(2)}
                    <button class="edit-item" data-index="${index}">✏️</button>
                    <button class="delete-item" data-index="${index}">🗑️</button>
                </li>
            `);
            legend.append(li);
        });
    }

    // Add new budget item
    $("#add-budget-item").on("click", function () {
        $("#budget-category").val('');
        $("#budget-amount").val('');
        $("#budget-modal").show().data("editIndex", null);
    });

    // Save budget item (add or edit)
    $("#save-budget-item").on("click", function () {
        const category = $("#budget-category").val();
        const amount = parseFloat($("#budget-amount").val());

        if (!category || isNaN(amount)) return alert("Enter valid data!");

        const editIndex = $("#budget-modal").data("editIndex");
        if (editIndex !== null) {
            budgetItems[editIndex] = { category, amount };
        } else {
            budgetItems.push({ category, amount });
        }

        $("#budget-modal").hide();
        renderChart();
        updateRemainingBudget();
    });

    // Cancel modal
    $("#cancel-budget-item").on("click", function () {
        $("#budget-modal").hide();
    });

    // Edit/Delete Handlers
    $(document).on("click", ".edit-item", function () {
        const index = $(this).data("index");
        $("#budget-category").val(budgetItems[index].category);
        $("#budget-amount").val(budgetItems[index].amount);
        $("#budget-modal").show().data("editIndex", index);
    });

    $(document).on("click", ".delete-item", function () {
        const index = $(this).data("index");
        budgetItems.splice(index, 1);
        renderChart();
        updateRemainingBudget();
    });
});
