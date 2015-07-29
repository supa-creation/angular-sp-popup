(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        // CommonJS
        module.exports = factory(require('angular'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD
        define(['angular'], factory);
    } else {
        // Global Variables
        factory(root.angular);
    }
}(this, function (angular) {
    'use strict';

    var module = angular.module('spPopup', []);

    module.provider('spPopup', function ()
    {
        var defaults = {
            template: 'views/sp-popup.html',
            contentTemplate: 'views/sp-popup-content.html',
            closeContent: '<img src="img/across-32.png" alt="Close" title="Close">',
            animation: {
                hide:500,
                show:500
            },
            preload:1,
            keyboard:!0
        };

        this.$get = function ($document, $http, $compile, $q, $templateCache, $timeout)
        {
            var $body = $document.find('body');

            return {
                open: function($element, options)
                {
                    var _this = this;
                    $q.all({
                        template:this.getTemplate(defaults.template)
                    }).then(function(setup)
                    {
                        var $popup = angular.element(setup.template),
                            elements = _this.eGetLeft($element);

                        var $scope = angular.extend($body.scope(), {
                            currentIndex: _this.eGetIndex($element, elements),
                            contents: elements.map(function(_$e){
                                return _this.eGetContent(_$e);
                            }),
                            group: _this.eGetGroup($element),
                            options: angular.extend(defaults, options),
                            $popup: $popup,
                            popup: $popup[0]
                        });

                        if(_this.isMobile()) {
                            $body.addClass('sp-popup-mobile');
                        }

                        $body.addClass('sp-popup-body')
                            .append($compile($popup)($scope));
                    });
                },
                close: function($s)
                {
                    $s.hidden = true;
                    $timeout(function() {
                        $body.removeClass('sp-popup-body');
                        $s.$popup.remove();
                        $s.$destroy();
                    }, $s.options.animation.hide);
                },

                isMobile: function(){
                    var r = false;
                    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))r = true;})(navigator.userAgent||navigator.vendor||window.opera);
                    return r;
                },

                getTemplate: function(url) {
                    return $http.get(url, {cache: $templateCache}).then(function (r) {
                        return r.data || '';
                    });
                },

                eGetAttr: function($e, key) {
                    return $e.attr('sp-popup-' + key) || '';
                },
                eGetContent: function($e)
                {
                    var type = this.eGetType($e);

                    return {
                        url: this.eGetAttr($e, type),
                        type: type,
                        loaded: false
                    };
                },
                eGetGroup: function($e) {
                    return this.eGetAttr($e, 'group');
                },
                eGetType: function($e) {
                    if ($e.attr('sp-popup-image')) {
                        return 'image';
                    }
                    return 'unknown';
                },
                eGetLeft: function($e)
                {
                    var s = '[sp-popup-group="'+this.eGetGroup($e)+'"]',
                        r = [];

                    angular.forEach($body[0].querySelectorAll(s), function(e) {
                        r.push(angular.element(e));
                    });

                    return r;
                },
                eGetIndex: function($e, $elements) {
                    var r = 0;
                    angular.forEach($elements, function(_$e, _$k) {
                        if(angular.equals($e, _$e)) {
                            r = _$k;
                        }
                    });
                    return r;
                }
            };
        };
    });

    module.controller('spPopup', [
        'spPopup', '$scope', '$element', '$timeout', '$compile', '$animate',
        function($spPopup, $scope, $element, $timeout, $compile, $animate)
        {
            $scope.preloadContents = $scope.contents.slice(0, 3);


            angular.extend($scope, {
                drag:false,

                next:  function() {
                    var idx = Math.min(this.contents.length - 1, this.currentIndex + 1);
                    this.goToIndex(idx);
                },
                prev:  function() {
                    var idx = Math.max(0, this.currentIndex - 1);
                    this.goToIndex(idx);
                },
                close: function() {
                    $spPopup.close(this);
                },

                getMargin: function()
                {
                    var $m = angular.element(this.popup.querySelectorAll('.sp-popup-margin'));
                    if($m.length) {
                        return $m[0].offsetWidth;
                    }
                    return 10;
                },
                goToIndex: function(index) {
                    this.currentIndex = index;
                },

                cIsLoaded: function(idx)
                {
                    if(typeof idx == 'undefined') {
                        idx = this.currentIndex;
                    }

                    var c = this.contents[idx];
                    if (c && c.loaded) {
                        return !0;
                    }
                    return !1;
                },
                cAppendAtIndex: function(idx)
                {
                    var $cWrpr = angular.element(this.popup.querySelector('.sp-popup-contents')),
                        $c = this.cGetAtIndex(idx);

                    if(!$c.length)
                    {
                        var $cS = this.$new();
                        $cS.content = this.contents[idx];
                        $cS.index = idx;
                        $cWrpr.append($compile('<sp-popup-content>')($cS));
                    }
                },
                cGetAtIndex: function(idx)
                {
                    var s = '.sp-popup-content[sp-popup-index="'+idx+'"]';
                    return angular.element(this.popup.querySelector(s));
                },
                cRemove: function(idx)
                {
                    var $c = this.cGetAtIndex(idx);
                    $c.scope().$destroy();
                    $c.remove();
                },
                cUpdateAll: function()
                {
                    var $s = this,
                        ct = this.options.preload,
                        cr  = this.currentIndex,
                        mn = Math.max(cr - ct, 0),
                        mx = Math.min(cr + ct, this.contents.length - 1);

                    this.cAppendAtIndex(cr);
                    for(var i = mn; i <= mx; i++) {
                        if(i != cr) {
                            this.cAppendAtIndex(i);
                        }
                    }

                    angular.forEach(this.popup.querySelectorAll('.sp-popup-content'), function(_c)
                    {
                        var idx = angular.element(_c).scope().index;
                        if(idx < mn || idx > mx) {
                            $s.cRemove(idx);
                        }
                    });
                },
                cUpdateSize: function(idx)
                {
                    var $c = this.cGetAtIndex(idx),
                        $s = $c.scope(),
                        cW = 0, cH = 0,
                        fW = 0, fH = 0,
                        wW = window.innerWidth, wH = window.innerHeight,
                        m = this.getMargin($c) * 2;

                    if ($s.content.type == 'image') {
                        var img = $c.find('img')[0];
                        cW = img.naturalWidth;
                        cH = img.naturalHeight;
                    }

                    var wR = cW / (wW - m), hR = cH / (wH - m);

                    if(wR > 1 || hR > 1)
                    {
                        if(wR > hR || (hR < 1 && wR > 1)) {
                            fW = wW - m;
                            fH = cH * fW / cW;
                        } else {
                            fH = wH - m;
                            fW = cW * fH / cH;
                        }
                    } else if(wR > 0 && hR > 0) {
                        fW = cW;
                        fH = cH;
                    }

                    $c.css({
                        width: fW + 'px',
                        height: fH + 'px',
                        top: ((wH - fH) / 2) + 'px',
                        left: ((wW - fW) / 2) + 'px'
                    });
                }
            });

            $scope.$watch('currentIndex', function() {
                $scope.cUpdateAll();
            });

            if ($scope.options.keyboard)
            {
                angular.element(document).bind("keydown keypress", function (e)
                {
                    $scope.$apply(function() {
                        var k = e.which;
                        if(k == 37) {
                            $scope.prev();
                        } else if(k == 39) {
                            $scope.next();
                        } else if(k == 27) {
                            $scope.close();
                        }
                    });
                });
            }

            $element
                .bind("touchstart", function(e)
                {
                    $scope.$apply(function() {
                        $scope.drag = true;
                        $scope.dragStart = e.touches[0].pageX;
                    });
                })
                .bind("touchmove", function(e)
                {
                    if($scope.drag) {
                        $scope.$apply(function() {
                            $scope.dragEnd = e.touches[0].pageX;
                        });
                    }
                })
                .bind("touchend", function(e)
                {
                    if($scope.drag)
                    {
                        $scope.$apply(function ()
                        {
                            var move = $scope.dragStart - $scope.dragEnd;

                            if(Math.abs(move) * 100 / window.innerWidth >= 10) {
                                $scope[(move > 0) ? 'next' : 'prev']();
                            }

                            $scope.drag = false;
                        });
                    }
                });
        }
    ]);

    module.directive('spPopupContent', [
        '$window', '$timeout',
        function($window, $timeout)
        {
            return {
                restrict: 'E',
                replace: !0,
                templateUrl: 'views/sp-popup-content.html',
                link: function($s, $c)
                {
                    $timeout(function ()
                    {
                        var $w = angular.element($window),
                            i = $s.index,
                            c = $s.content;

                        if (c.loaded) {
                            $s.cUpdateSize(i);
                        } else {
                            if (c.type == 'image')
                            {
                                $c.find('img').bind('load', function () {
                                    $s.$apply(function() {
                                        c.loaded = true;
                                        $s.cUpdateSize(i);
                                    });
                                });
                            }
                        }

                        var rzHandler = function () {
                            $s.cUpdateSize(i);
                        };

                        $w.bind('resize', rzHandler);

                        $s.$on('$destroy', function () {
                            $w.unbind('resize', rzHandler);
                        });
                    });
                }
            };
        }
    ]);

    module.directive('spPopupImage', [
        'spPopup',
        function($spPopup)
        {
            return {
                restrict: 'A',
                link: function($s, $e)
                {
                    $e.bind('click', function(e) {
                        $spPopup.open($e);

                        e.preventDefault();
                    });
                }
            };
        }
    ]);

    return module;
}));