# Somtoday Mod V2

Fork van [Somtoday Mod](https://github.com/Jona-Zwetsloot/Somtoday-Mod), met uitgebreid instelbare transparantie en achtergrondvervaging voor Somtoday.

## Nieuw in deze fork

- Transparantie en blur per onderdeel: rooster, cijfers, berichten, navigatie, detailvakken en meer.
- Glaseffect op volledige desktopzijpanelen en pop-ups, inclusief de buitenste achtergrond en lege ruimte.
- Ook het Somtoday Mod-instellingenmenu en de mod-dialogen krijgen glas.
- De bestaande UI-transparantie en UI-blur werken nu ook op zijpanelen en modals.
- Ondersteuning voor lichte, donkere en Night-kleurpaletten. Tekst en iconen blijven scherp.

De aanpassingen zitten momenteel alleen in de **Chromium-versie** (Chrome, Edge en Helium). Firefox, Android en het userscript bevatten nog de oorspronkelijke versie.

## Installeren

1. Download deze repository via **Code → Download ZIP** en pak het bestand uit, of clone de repository.
2. Open `chrome://extensions` (Chrome/Helium) of `edge://extensions` (Edge).
3. Schakel een eventueel bestaand exemplaar van Somtoday Mod uit. Exporteer vooraf je Mod-instellingen als je die wilt overnemen.
4. Zet ontwikkelaarsmodus aan, kies **Uitgepakte extensie laden** en selecteer de map **Chromium** uit deze repository.
5. Herlaad Somtoday. Stel de bestaande UI-schuifjes in of gebruik **Mod-instellingen → Glaseffect** voor instellingen per onderdeel.

Zie [GLASEFFECT.md](GLASEFFECT.md) voor de opties, tests en bekende beperkingen. De wijzigingen zijn lokaal getest; volledige validatie van de geïnstalleerde extensie op alle Somtoday-pagina's staat nog open.

## Herkomst en licentie

Gebaseerd op het werk van Jona Zwetsloot en de oorspronkelijke bijdragers. De oorspronkelijke [CC BY-NC-SA 4.0-licentie](LICENSE.md) blijft van toepassing. Deze fork is niet verbonden aan Somtoday/Topicus.

## Oorspronkelijke documentatie

Onderstaande winkel- en releaselinks horen bij het oorspronkelijke project; ze installeren niet deze V2-fork.

# Somtoday Mod
Somtoday Mod is a free browser-extension which adjusts the student website of Somtoday. With Somtoday Mod you can customise your Somtoday by setting your own backgrounds, colors, fonts, layouts and more. It also improves the functionality of Somtoday, by adding graphs to the grades pages and offering an auto-login function. At the end of the year you can view a recap of your grades with a fun quiz. And do you want to change the names of your teacher? This is also possible with Somtoday Mod, alongside many other options. Somtoday Mod is available in the Chrome Webstore, Edge Addons and Firefox Add-ons as extension. It is also available as userscript. Somtoday Mod is not affiliated with Somtoday/Topicus.

[![Button Chrome]][ChromeLink]
[![Button Edge]][EdgeLink]
[![Button Firefox]][FirefoxLink]

<br>

# Install

You can install the official release of Somtoday Mod in the extension stores (see links above). You can also modify Somtoday Mod and install it by using one of the methods below.

<details>
<summary>Chromium extension</summary>
<br>

Chromium extension:
1. Go to the <a href="https://github.com/Jona-Zwetsloot/Somtoday-Mod/releases">releases page</a> and download chromium.zip
2. Unpack chromium.zip
3. Go to the extension page and enable developer mode
4. Click 'Load unpacked extension' and select the unpacked zip
<br>

</details>



<details>
<summary>Firefox extension</summary>
<br>

Firefox extension - <b>temporary</b>, but easy:
1. Go to the <a href="https://github.com/Jona-Zwetsloot/Somtoday-Mod/releases">releases page</a> and download firefox.zip
2. Go to <b>about:debugging#/runtime/this-firefox</b>, click 'Install temporary addon' and select firefox.zip
<br>

Firefox Developer, Firefox Nightly or Firefox ESR extension - <b>permanent</b>, but a few more steps:
1. Go to the <a href="https://github.com/Jona-Zwetsloot/Somtoday-Mod/releases">releases page</a> and download firefox.zip
2. Go to <b>about:config</b> and disable the flag <b>xpinstall.signatures.required</b>
3. Go to <b>about:addons</b>, click on the top right cog, click 'Install addon via file' and select firefox.zip
<br>

</details>



<details>
<summary>Userscript</summary>
<br>

Userscript:
1. Install an userscriptmanager (<a href="https://tampermonkey.net/">Tampermonkey</a> - all browsers, <a href="https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/">Greasemonkey</a> - Firefox, <a href="https://apps.apple.com/us/app/userscripts/id1463298887">Userscripts</a> - Safari)
2. Add <a href="https://github.com/Jona-Zwetsloot/Somtoday-Mod/blob/main/Userscript/SomtodayMod.user.js">this userscript</a> to the userscript manager
<br>

</details>



<details>
<summary>Android</summary>
<br>

Android app:
1. Install **Android Studio**
2. Import the Android folder as an Android Studio Project
<br>

</details>

<!---------------------------------------------------------------------------->
[Button Chrome]: https://jonazwetsloot.nl/images/chrome-webstore.svg
[ChromeLink]: https://chromewebstore.google.com/detail/somtoday-mod/gehilkhfalphnhpidceocgmdijplpkbn 'Install in the Chrome Webstore.'
[Button Edge]: https://jonazwetsloot.nl/images/edge-addons.svg
[EdgeLink]: https://microsoftedge.microsoft.com/addons/detail/somtoday-mod/ldhlddmnhkkjnocncckkencgcmgmffme 'Install in the Edge Addons Store.'
[Button Firefox]: https://jonazwetsloot.nl/images/firefox-addons.svg
[FirefoxLink]: https://addons.mozilla.org/nl/firefox/addon/somtoday-mod/ 'Install in the Firefox Addons Store.'
