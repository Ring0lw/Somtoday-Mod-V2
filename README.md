# Somtoday Mod V2

**Somtoday Mod V2 is een onafhankelijke fork van [Somtoday Mod](https://github.com/Jona-Zwetsloot/Somtoday-Mod), met nieuwe functies en verbeteringen boven op het oorspronkelijke project.** De bestaande mogelijkheden blijven behouden, aangevuld met uitgebreid instelbare transparantie en glaseffecten.

## Waarom deze fork?

De oorspronkelijke maker, Jona Zwetsloot, heeft geen toegang meer tot Somtoday. Daardoor kan hij wijzigingen niet meer in zijn eigen Somtoday-omgeving testen. In zijn [verklaring over het onderhoud](https://github.com/Jona-Zwetsloot/Somtoday-Mod/blob/main/CONTRIBUTING.md) geeft hij aan dat het oorspronkelijke project sinds september 2026 geen nieuwe pull requests meer accepteert.

**V2 bouwt verder op dat werk met nieuwe functies.** Deze fork wordt apart ontwikkeld en staat los van de oorspronkelijke maker. De uitbreidingen hieronder zijn beschikbaar in V2; de oorspronkelijke winkelversie bevat deze aanpassingen niet.

## Nieuwe functies in V2

- Transparantie en blur per onderdeel: rooster, cijfers, berichten, navigatie, detailvakken en meer.
- Glaseffect op volledige desktopzijpanelen en pop-ups, inclusief de buitenste achtergrond en lege ruimte.
- Ook het Somtoday Mod-instellingenmenu en de mod-dialogen krijgen glas.
- De bestaande UI-transparantie en UI-blur werken nu ook op zijpanelen en modals.
- Ondersteuning voor lichte, donkere en Night-kleurpaletten. Tekst en iconen blijven scherp.
- Lokale cijferwijzigingen voor **Laatste cijfers** en **Vakgemiddelden**, opgeslagen op deze browser en behouden na vernieuwen.

De aanpassingen zitten momenteel alleen in de **Chromium-versie** (Chrome, Edge en Helium). Firefox, Android en het userscript bevatten nog de oorspronkelijke versie.

## Installeren

1. Download deze repository via **Code → Download ZIP** en pak het bestand uit, of clone de repository.
2. Open `chrome://extensions` (Chrome/Helium) of `edge://extensions` (Edge).
3. Schakel een eventueel bestaand exemplaar van Somtoday Mod uit. Exporteer vooraf je Mod-instellingen als je die wilt overnemen.
4. Zet ontwikkelaarsmodus aan, kies **Uitgepakte extensie laden** en selecteer de map **Chromium** uit deze repository.
5. Herlaad Somtoday. Stel de bestaande UI-schuifjes in of gebruik **Mod-instellingen → Glaseffect** voor instellingen per onderdeel.

De wijzigingen zijn lokaal getest; volledige validatie van de geïnstalleerde extensie op alle Somtoday-pagina's staat nog open.

## Lokale cijfers aanpassen

Open **Cijfers → Laatste cijfers** of **Vakgemiddelden** en klik op **Lokale cijfers aanpassen**. Vul een cijfer of letterbeoordeling in en kies **Opslaan**. Een opgeslagen wijziging wordt direct zichtbaar zonder extra achtergrond of label onder het cijfer en blijft staan na vernieuwen of herstarten van de browser. De tooltip vermeldt de lokale wijziging en het originele cijfer.

- **Herstellen** verwijdert één wijziging; **Alle lokale cijfers herstellen** verwijdert alle wijzigingen voor dit profiel, inclusief andere schooljaren.
- Met **Lokale wijzigingen tonen** kun je de originele weergave tijdelijk terugzetten zonder je wijzigingen te wissen.
- Vakgemiddelden stel je apart in. De officiële gegevens, berekeningen en cijferexports blijven ongewijzigd; er wordt niets naar Somtoday verstuurd.
- Wijzigingen staan alleen in de lokale extensieopslag. Ze worden niet gesynchroniseerd en zitten niet in de export van Mod-instellingen. Verwijderen van de extensie wist ze.
- Profielen worden herkend aan de Somtoday-profielfoto-URL. Zonder geladen profielfoto wordt aanpassen uitgeschakeld. Bij een gewijzigde foto-URL moet je wijzigingen mogelijk opnieuw instellen. Schooljaar, vak, beoordelingstype en toetsomschrijving onderscheiden de cijfers; onbekende of dubbele kaarten worden overgeslagen. Een wijziging van deze kenmerken kan opnieuw instellen nodig maken.

De tests gebruiken fictieve cijfers: `node --test tests/*.test.cjs` voor validatie en `tests/grade-overrides-preview.html` via een lokale webserver voor de browsertests. Vernieuwen, opnieuw geladen kaarten, herstellen, profiel- en schooljaarscheiding zijn getest. De actuele Vakgemiddelden-structuur is gecontroleerd; Laatste cijfers bevatte tijdens de controle geen cijfers en is met een representatieve testpagina getest.

## Herkomst en licentie

Gebaseerd op het werk van Jona Zwetsloot en de oorspronkelijke bijdragers. De oorspronkelijke [CC BY-NC-SA 4.0-licentie](LICENSE.md) blijft van toepassing. Deze fork is niet verbonden aan Somtoday/Topicus.

## Oorspronkelijk project

Met dank aan Jona Zwetsloot en alle oorspronkelijke bijdragers voor de basis van deze fork. De oorspronkelijke documentatie en eerdere versies zijn te vinden in [Jona-Zwetsloot/Somtoday-Mod](https://github.com/Jona-Zwetsloot/Somtoday-Mod).
