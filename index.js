$(document).ready(function() {
    $("h3").mouseenter(function(evt) {
        if ($(this).hasClass("firstProject") || $(this).hasClass("secondProject") || $(this).hasClass("thirdProject")) {
            $(this).css("color", "green");
        }
    });
    $("h3").mouseleave(function() {
        if ($(this).hasClass("firstProject") || $(this).hasClass("secondProject") || $(this).hasClass("thirdProject")) {
            $(this).css("color", "white");
        }
    });
});

