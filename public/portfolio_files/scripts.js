;(function () {
    "use strict";

    var $window, $document, $body;

    $window = $(window);
    $document = $(document);
    $body = $("body");

    $document.ready(function () {
        /*==============================================
         Retina support added
         ===============================================*/
        if (window.devicePixelRatio > 1) {
            $(".retina").imagesLoaded(function () {
                $(".retina").each(function () {
                    var src = $(this).attr("src").replace(".", "@2x.");
                    var h = $(this).height();
                    $(this).attr("src", src).css({height: h, width: "auto"});
                });
            });
        }

        /*==============================================
         form support
         ===============================================*/
        $( '#submit' ).click( function ( e ) {
            let $name = $( 'input[name="name"]' );
            let $email = $( 'input[name="email"]' );
            let interested = $( '.desc > input[type="checkbox"]:checked' ).map(function() {
                    return $( this ).val();
                })
                .get()
                .join( ',' ).split( ',' );
            
            let $submit = $( this );
            $submit.fadeOut( '500' );
            $( 'h4.error' ).remove();

            if ( $name.val().length == 0 ) {
                alert( 'Name cannot be blank' );
                return;
            }

            if ( $email.val().length == 0 ) {
                alert( 'Email cannot be blank' );
                return;
            }

            $.ajax( {
                type: 'POST',
                url: '/email',
                data: {
                    name: $name.val(),
                    email: $email.val(),
                    interested: interested
                },
                error: function ( x, s, e ) {
                    console.log(x);
                    console.log(s);
                    console.log(e);

                    $submit.fadeIn( '500' );
                },
                success: function ( res ) {
                    if ( res.error ) {
                        console.log( $( this ) );
                        $submit.fadeIn( '500' );
                        $submit.parent().append( `<h4 class="error">${ res.error }</h4>` );
                        return;
                    }

                    $submit.parent().append( '<h4>Email Submitted</h4>' );
                }
            } );
        } )


        /*==============================================
         Smooth scroll init
         ===============================================*/
        if (typeof smoothScroll == "object") {
            smoothScroll.init();
        }


        /*==============================================
         Menuzord init
         ===============================================*/
        $(".js-primary-navigation").menuzord();


        /*==============================================
         Onepage nav init
         ===============================================*/
        $(".op-nav li").on("click", function () {
            if ($(".showhide").is(":visible")) {
                $(".showhide").trigger("click");
            }
        });

        if ($.fn.onePageNav) {
            $(".op-nav").onePageNav({
                currentClass: "active"
            });
        }


        /*==============================================
         Sticky nav
         ===============================================*/
        function initSticky() {
            var $navbarSticky, navbarHeight, $brandLogo, centerLogoNormalHeight, centerLogoStickyHeight;
            $navbarSticky = $(".js-navbar-sticky").not(".l-navbar_s-left");
            navbarHeight = $navbarSticky.height();
            $brandLogo = $(".logo-brand");
            centerLogoNormalHeight = 100;
            centerLogoStickyHeight = 60;

            if ($navbarSticky.hasClass("l-navbar_s-center")) {
                $brandLogo.height(centerLogoNormalHeight);
            }

            $navbarSticky.sticky({
                className: "l-navbar-wrapper_has-sticky",
                wrapperClassName: "l-navbar-wrapper",
                zIndex: 10000,
                bottomSpacing: 100
            }).on("sticky-start", function() {
                if ($navbarSticky.hasClass("l-navbar_s-center")) {
                    $brandLogo.height(0);
                    setTimeout(function() {
                        $brandLogo.addClass("sticky-fix").height(centerLogoStickyHeight);
                    }, 300);
                }
            }).on("sticky-end", function () {
                $navbarSticky.parent().height(navbarHeight);
                if ($navbarSticky.hasClass("l-navbar_s-center")) {
                    $brandLogo.removeClass("sticky-fix").height(centerLogoNormalHeight);
                }
            });
        }
        initSticky();


        /*==============================================
         Full screen banner init
         ===============================================*/
        $window.bind("resizeEnd", function () {
            $("#fullscreen-banner").height($window.height());
        });

        $window.resize(function () {
            if (this.resizeTO) clearTimeout(this.resizeTO);
            this.resizeTO = setTimeout(function () {
                $(this).trigger("resizeEnd");
            }, 300);
        }).trigger("resize");


        /*==============================================
         Toggle init
         ===============================================*/
        var allToggles = $(".toggle > dd").hide();
        $(".toggle > dt > a").click(function () {

            if ($(this).hasClass("active")) {

                $(this).parent().next().slideUp("easeOutExpo");
                $(this).removeClass("active");

            }
            else {
                var current = $(this).parent().next("dd");
                $(this).addClass("active");
                $(this).parent().next().slideDown("easeOutExpo");
            }

            return false;
        });


        /*==============================================
         Back to top init
         ===============================================*/
        $body.append("<a data-scroll class='lift-off js-lift-off lift-off_hide' href='#'><i class='fa fa-angle-up'></i></a>");

        var $liftOff = $(".js-lift-off");
        $window.on("scroll", function () {
            if ($window.scrollTop() > 150) {
                $liftOff.addClass("lift-off_show").removeClass("lift-off_hide");
            } else {
                $liftOff.addClass("lift-off_hide").removeClass("lift-off_show");
            }
        });
    });
})(jQuery);
