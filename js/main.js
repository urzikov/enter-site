$(function () {

    var
        pages = {
            index: 1,
            interface: 2,
            menutuning: 3,
            devices: 4,
            technologies: 5,
//            algorithms: 10,
            implementation: 6,
            solutions: 7,
            costs: 8,
            contacts: 9
        },

        video = document.getElementById("implementation-video"),

        scroller = $(".pages").onepage_scroll({

            animationTime: 500,

            keyboard: true,
            loop: false,

            afterMove:function(pageIndex){
                $(".arrow").parents("section").each(function(){
                    if($(this).offset().top === 0){
                        $(this).find(".arrow").removeClass("hidden").addClass("animated")
                    }
                });
                if (pageIndex == pages.implementation) {

                        video.play();
                }
            },

            beforeMove: function(pageIndex) {
                if(pageIndex == pages.index){
                    $("header").removeClass("navbar-fixed-top").addClass("navbar-fixed-bottom");
                }else{
                    $("header").removeClass("navbar-fixed-bottom").addClass("navbar-fixed-top");
                }

                if(pageIndex >= pages.technologies && pageIndex < pages.solutions ){
                    $("header").removeClass("navbar-navbar-default").addClass("navbar-inverse");
                }else{
                    $("header").removeClass("navbar-inverse").addClass("navbar-navbar-default");
                }

                var index = $($(".landing section")[pageIndex - 1]).data("menuItemIndex"),
                    menuElements = $(".navbar-nav li"),
                    parent = menuElements.parents(".navbar-nav"),
                    marker = parent.find("li.marker");

                if(index >= 0){
                    var element = $(menuElements[index]);
                    parent.find(".active").removeClass("active");
                    element.addClass("active");

                    marker.removeClass("hidden").css("left", element.position().left+"px")
                        .css("top", element.position().top+"px")
                        .width(element.outerWidth())
                        .height( element.outerHeight());
                }else{
                    marker.removeClass("addClass");
                    parent.find(".active").removeClass("active");
                }

                /*        marker.stop().animate({
                 left: element.position().left,
                 width: element.outerWidth(),
                 height: element.outerHeight()
                 }, 700);*/
            }
        }),

        initCarousel = function(el){

            el.carousel({
                interval: false
            });

            $('[id^=' + el.attr("id") + '-selector-]').click( function(){
                var id_selector = $(this).attr("id");
                var id = id_selector.substr(id_selector.length -1);
                id = parseInt(id);
                el.carousel(id);
                $('[id^='+ el.attr("id") +'-selector-]').removeClass('selected');
                $(this).addClass('selected');
            });

/*            el.bind('slid.bs.carousel', function() {
                var id = $('.item.active').data('slide-number');
                id = parseInt(id);
                $('[id^='+ el.attr("id") +'-selector-]').removeClass('selected');
                $('[id^='+ el.attr("id") +'-selector-'+id+']').addClass('selected');
            });*/
        };

    initCarousel($("#settings-carousel"));
    initCarousel($("#devices-carousel"));



    $('.navbar-collapse a').click(function (e) {
        $('.navbar-collapse').collapse('toggle');
    });

    var selectSliderItem = function(element){
        var parent = element.parents(".slider-thumbs");
        var marker = parent.find("li.marker");

        /*        marker.stop().animate({
         left: element.position().left,
         width: element.outerWidth(),
         height: element.outerHeight()
         }, 700);*/
        marker.css("left", element.position().left+"px")
            .css("top", element.position().top+"px")
            .width(element.width())
            .height( element.height());
    };

    $(".slider-thumbs li").click(function(){
        if(!$(this).hasClass("marker")){
            selectSliderItem($(this));
        }
    });

    $(".navbar-nav li").click(function(){
        var element = $(this);
        if(!$(this).hasClass("marker")){
            var parent = element.parents(".navbar-nav");
            parent.find(".active").removeClass("active");
            var marker = parent.find("li.marker");

            /*        marker.stop().animate({
             left: element.position().left,
             width: element.outerWidth(),
             height: element.outerHeight()
             }, 700);*/

            element.addClass("active");
            marker.css("left", element.position().left+"px")
                .css("top", element.position().top+"px")
                .width(element.outerWidth())
                .height( element.outerHeight());
        }
    });

    $("[data-link]").click(function(e){
        $(".pages").moveTo(pages[$(this).data("link")]);
        e.preventDefault();
    });

    $(".slider-thumbs .selected").each(function(index, item){
        selectSliderItem($(item));
    });

    $("#tech-carousel, #costs-carousel, #solutions-carousel").owlCarousel({
        slideSpeed : 300,
        paginationSpeed : 400,
        singleItem:true,
        pagination: true,
        responsiveFallback: true,
        navigation : true,
        navigationText : false
    });

    $(".owl-item").click(function(){
        $(this)
            .parents(".owl-carousel")
            .data('owlCarousel')
            .next();
    });

    var width = 960,
        height = 800;

    var svg = d3.select("#map-wrapper").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("id", "map-svg")
        .style("margin", "65px auto 0px")
        .style("display", "block");

    var projection = d3.geo.albers()
        .rotate([-105, 0])
        .center([-10, 65])
        .parallels([52, 64])
        .scale(700)
        .translate([width / 2, height / 2]);

    var path = d3.geo.path().projection(projection);

    queue()
        .defer(d3.json, "map/russian-map.json")
        .defer(d3.json, "map/offices.json")
        .defer(d3.json, "map/mapData.json")
        .await(ready);


    function ready(error, map, offices, mapData) {

        /*svg.append("g")
            .attr("class", "region")
            .selectAll("path")
            .data(topojson.object(map, map.objects.russia).geometries)
            //.data(topojson.feature(map, map.objects.russia).features) <-- in case topojson.v1.js
            .enter().append("path")
            .attr("d", path)
            .style("fill", "#FFF")
            .style("opacity", 0.8)*/

        //svg.attr('viewBox', '0 0 2040 1230');
        svg.append('path')
            .attr('stroke', '#000000')
            .attr('d', mapData.d)
            .attr('fill', 'none')
            //.attr('transform', 'scale(0.3)');


        d3.tsv("map/cities.tsv", function(error, data) {

            var city = svg.selectAll("g.city")
                .data(data)
                .enter()
                .append("g")
                .attr("class", "city")
                .attr("transform", function(d) { return "translate(" + d.lon + ',' + d.lat + ")"; });

            city.on("click", function(d){

                var attrs  = /translate\(\s*([^\s,)]+)[ ,]([^\s,)]+)/.exec(this.getAttribute('transform'));
                var x = +attrs[1],
                    y = +attrs[2];
                var xx = $("#map-svg").offset().left - $("#map-wrapper").offset().left;

                $("#offices").css("top", $("#map-wrapper").offset().top - this.getBBox().height + y + "px")
                             .css("left", this.getBBox().width + x + xx + "px")
                             .show();

                var source   = $("#offices-template").html();
                var template = Handlebars.compile(source);
                $("#offices-content").html(template(offices[d.City]));
                $(".nano").nanoScroller();

            });


            city.append("circle")
                .attr("r", 3)
                .style("fill", "#F60")
                .style("opacity", 0.75);

            city.append("text")
                .attr("x", 5)
                .attr('font-size', '15px')
                .text(function(d) { return d.City; });
        });

    };

    $("body").click(function(e){
        if(!$(e.target).parents(".city").length &&
           !$(e.target).parents("#offices").length ){
            $("#offices").hide()
        }
    });

    $(window).resize(function(){

    });

    video.addEventListener('error', function() {
        video.style.width = '100%';
        video.style.height = '100%';
    });


    function validateEmail (email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    $('body').on('click', '.send-request', function (evnt) {
        evnt.preventDefault();
        $('#name').val('');
        $('#mail').val('');
        $('#tel').val('');
        $('#text').val('');
        $('.request-info').remove();
        $('.submit-request').removeAttr('disabled');
        $('#request-form').modal('show');
        yaCounter42159674.reachGoal('ostavit_zayavku');
    });

    $('body').on('click', '.submit-request', function (evnt) {
        if (($('#tel').val().length != 0) || (($('#mail').val().length != 0) && (validateEmail($('#mail').val())))) {
            var reqData = {
                name:    $('#name').val(),
                mail:    $('#mail').val(),
                tel:     $('#tel').val(),
                text:    $('#text').val(),
            };
            $('#request-form .modal-footer').append('<div class="request-info">Спасибо! В ближайшее время мы с вами свяжемся</div>');
            $('.submit-request').attr('disabled', 'disabled');
            yaCounter42159674.reachGoal('otpravit');
            $.post('/feedback', reqData, function (data) {
                if (!data || data.length == 0) {
                    console.log('Что-то пошло не так с отправкой формы')
                }
            }, 'json');
        } else {
            if ($('#mail').val().length != 0) {
                $('#mail').addClass('form-error');
                $('#mail').focus();
            } else {
                $('#tel').addClass('form-error');
                $('#mail').addClass('form-error');
                $('#tel').attr('placeholder', 'нужен хотя-бы один способ связи');
                $('#mail').attr('placeholder', 'нужен хотя-бы один способ связи');
            }
        }
    });

    $('body').on('keyup', 'input', function (evnt) {
        $('input').removeClass('form-error');
    });

});