$('#recipeCarousel').carousel({
    interval: 10000
})

$('#recipeCarousel').carousel({
    interval: 10000
})

$('.c1 .c2').each(function () {
    var minPerSlide = 3;
    var next = $(this).next();
    if (!next.length) {
        next = $(this).siblings(':first');
    }
    next.children(':first-child').clone().appendTo($(this));

    for (var i = 0; i < minPerSlide; i++) {
        next = next.next();
        if (!next.length) {
            next = $(this).siblings(':first');
        }

        next.children(':first-child').clone().appendTo($(this));
    }
});

$(".book").on('click',function(){
    $(".custom-select").val($('.book').val());
    $('html, body').animate({
        scrollTop: $("#order").offset().top
    }, 1000);
});
$(".book1").on('click', function () {
    $(".custom-select").val($('.book1').val());
    $('html, body').animate({
        scrollTop: $("#order").offset().top
    }, 1000);
});
$(".book2").on('click', function () {
    $(".custom-select").val($('.book2').val());
    $('html, body').animate({
        scrollTop: $("#order").offset().top
    }, 1000);
});
$(".book3").on('click', function () {
    $(".custom-select").val($('.book3').val());
    $('html, body').animate({
        scrollTop: $("#order").offset().top
    }, 1000);
});
$(".book4").on('click', function () {
    $(".custom-select").val($('.book4').val());
    $('html, body').animate({
        scrollTop: $("#order").offset().top
    }, 1000);
});
$(".book5").on('click', function () {
    $(".custom-select").val($('.book5').val());
    $('html, body').animate({
        scrollTop: $("#order").offset().top
    }, 1000);
});
$(".book6").on('click', function () {
    $(".custom-select").val($('.book6').val());
    $('html, body').animate({
        scrollTop: $("#order").offset().top
    }, 1000);
});

var doc = new jsPDF();
$('.carousel .carousel-item').each(function () {
    var minPerSlide = 3;
    var next = $(this).next();
    if (!next.length) {
        next = $(this).siblings(':first');
    }
    next.children(':first-child').clone().appendTo($(this));

    for (var i = 0; i < minPerSlide; i++) {
        next = next.next();
        if (!next.length) {
            next = $(this).siblings(':first');
        }

        next.children(':first-child').clone().appendTo($(this));
    }
});


{
    $(".btn-kk").on('click', function () {
        doc.fromHTML($('body').html(), 15, 15,);
        doc.save('Order.pdf');
    })
}
var a;
$(".a").on('click',function(){
    $(".a").addClass("checked");
    a=1;
    $(".btn-lo").val(a)
})
$(".b").on('click', function () {
    $(".a,.b").addClass("checked");
    a=2;
    $(".btn-lo").val(a)
})
$(".c").on('click', function () {
    $(".a,.b,.c").addClass("checked");
    a=3;
    $(".btn-lo").val(a)
})
$(".d").on('click', function () {
    $(".a,.b,.c,.d").addClass("checked");
    a=4;
    $(".btn-lo").val(a)
})
$(".e").on('click', function () {
    $(".a,.b,.c,.d,.e").addClass("checked");
    a=5;
    $(".btn-lo").val(a)
})


$(".a").on('click', function () {
    $(".b,.c,.d,.e").removeClass("checked");
    a=1;
    $(".btn-lo").val(a)
})
$(".b").on('click', function () {
    $(".c,.d,.e").removeClass("checked");
    a=2;
    $(".btn-lo").val(a)
})
$(".c").on('click', function () {
    $(".d,.e").removeClass("checked");
    a=3;
    $(".btn-lo").val(a)
})
$(".d").on('click', function () {
    $(".e").removeClass("checked");
    a=4;
    $(".btn-lo").val(a)
})
$(".e").on('click', function () {
    $("").removeClass("checked");
    a=5;
    $(".btn-lo").val(a)
})

