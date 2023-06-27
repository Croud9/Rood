# Pin npm packages by running ./bin/importmap

pin "application", preload: true
pin "snapsvg-cjs", to: "https://ga.jspm.io/npm:snapsvg-cjs@0.0.6/dist/snap.svg-cjs.js"
pin "eve", to: "https://ga.jspm.io/npm:eve@0.5.4/eve.js"
pin "jquery", to: "https://ga.jspm.io/npm:jquery@3.7.0/dist/jquery.js"
pin "@hotwired/turbo-rails", to: "turbo.min.js", preload: true
pin "@hotwired/stimulus", to: "stimulus.min.js", preload: true
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js", preload: true
pin_all_from "app/javascript/controllers", under: "controllers"
pin "svg-pan-zoom", to: "https://ga.jspm.io/npm:svg-pan-zoom@3.6.1/src/browserify.js"
