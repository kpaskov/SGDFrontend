module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        replace: {
            datatables_images: {
                src: ["bower_components/datatables-plugins/integration/foundation/dataTables.foundation.css"],
                overwrite: true,
                replacements: [{
                    from: "images/",
                    to: "../img/"
                }]
            }
        },
        uglify: {
            modernizr: {
                files: {
                    "src/sgd/frontend/yeastgenome/static/js/build/modernizr.min.js": ["bower_components/modernizr/modernizr.js"]
                }
            },
            datatables: {
                files: {
                    "src/sgd/frontend/yeastgenome/static/js/build/datatables/datatables.min.js": ["bower_components/datatables/media/js/jquery.datatables.js"]
                }
            },
            datatablesplugins: {
                files: {
                    "src/sgd/frontend/yeastgenome/static/js/build/datatables/datatables.foundation.min.js": ["bower_components/datatables-plugins/integration/foundation/datatables.foundation.js"]
                }
            },
            fastclick: {
                files: {
                    "src/sgd/frontend/yeastgenome/static/js/build/fastclick.min.js": ["bower_components/fastclick/lib/fastclick.js"]
                }
            }
        },
        bowercopy: {
            js: {
                options: {
                    destPrefix: "src/sgd/frontend/yeastgenome/static/js/build"
                },
                files: {
                    "cytoscape.min.js": "cytoscape/documentation/js/cytoscape.min.js",
                    "arbor.js": "cytoscape/documentation/js/arbor.js",
                    "foundation.min.js": "foundation/js/foundation.min.js",
                    "jquery.min.js": "jquery/dist/jquery.min.js",
                    "kinetic.min.js": "kineticjs/kinetic.min.js",
                    "respond.min.js": "respond/dest/respond.min.js",
                    "rem.min.js": "rem-unit-polyfill/js/rem.min.js",
                    "nouislider.min.js": "nouislider/jquery.nouislider.min.js"
                }
            },
            scss: {
                options: {
                    destPrefix: "src/sgd/frontend/yeastgenome/static/scss"
                },
                files: {
                    "normalize.scss": "foundation/scss/normalize.scss",
                    "build/_nouislider.scss": "nouislider/jquery.nouislider.css",
                    "build/_dataTables.foundation.scss": "datatables-plugins/integration/foundation/dataTables.foundation.css"
                }
            },
            fonts: {
                files: {
                    "src/sgd/frontend/yeastgenome/static/fonts": "font-awesome/fonts"
                }
            },
            images: {
                files: {
                    "src/sgd/frontend/yeastgenome/static/img": "datatables-plugins/integration/foundation/images"
                }
            }
            
        }
    });
    
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks("grunt-bowercopy");
    
    grunt.registerTask('default', ['replace','uglify', 'bowercopy']);
};