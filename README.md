Générateur de calendrier Futur en Seine
=======================================

[Futur en Seine](http://www.futur-en-seine.fr/) c'est génial, parce qu'il y a énormément d'événements… Tellement que se repérer dans l'[agenda](http://www.futur-en-seine.fr/calendrier/) n'est pas évident !

Du coup, j'ai écrit ce générateur de calendrier au format iCal  :)

Pour accéder au calendrier, **utilisez la [version publiée](http://mattischneider.fr/futur-en-seine/2012/calendrier/) sur Google Calendar**. L'intérêt ici est d'accéder au code et éventuellement d'améliorer l'extraction.

Actuellement, seuls 114 événements sur 305 sont extraits (37%). Si vous savez coder en Javascript, vous pouvez améliorer ce résultat en ajoutant des extracteurs supplémentaires !

Technique
---------

Ce projet utilise [Node.js](http://nodejs.org), [PhantomJS](http://www.phantomjs.org) (Webkit headless) et [CasperJS](http://casperjs.org) pour contrôler Phantom.

Suite à un crash de Phantom quand trop d'URL lui sont donné à charger d'affilée, et vu que je n'ai pas vraiment eu le temps d'en investiguer plus avant la raison, le travail d'extraction de la liste des événements est séparé de celui de d'extraction des informations spécifiques à un événement.

Le script `calendar-extractor.js` va donc générer la liste d'URLs des événements individuels à partir du calendrier de FenS, et `calendar-generator.js` va générer la description au format iCal des événements dont l'URL lui est passée en paramètre. Un nouveau processus est donc lancé pour chaque événement, et PhantomJS n'a pas le temps de saturer  ;)

Le pont entre ces deux scripts est automatisé, il suffit donc d'avoir Node installé (`nodejs.org` ou `brew install node` sous OS X avec [Homebrew](http://mxcl.github.com/homebrew/)), CasperJS et PhantomJS (`brew install casperjs` ou sites individuels, encore une fois). Ensuite :

    ./dumpall.sh

…qui vous générera FuturEnSeine.ics, un beau calendrier au formar iCal  :)