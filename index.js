$(document).ready(function() {
    $("h3").mouseenter(function(evt) {
        var bgImage = "";

        if ($(this).hasClass("firstProject")) {
            bgImage = "./images/mts-shorts-preview.gif";
            bgSize  = "cover";
        } else if ($(this).hasClass("secondProject")) {
            bgImage = "./images/portfolio-management-preview.gif";
            bgSize  = "130%";
        } else if ($(this).hasClass("thirdProject")) {
            bgImage = "./images/mts-salary-preview.gif";
            bgSize  = "cover";
        }

        $(this).closest(".card-cover").css({
            "background-image":  `url('${bgImage}')`,
            "background-size":   bgSize,
            "background-position":"center",
            "background-repeat": "no-repeat"
        });

        $(this).css("opacity", "0");
        $(this).siblings("p").css("opacity", "0");
    });

    $("h3").mouseleave(function(evt) {
        $(this).closest(".card-cover").css({
            "background-image": "",
        });

        $(this).css("opacity", "1");
        $(this).siblings("p").css("opacity", "1");
    });
});

