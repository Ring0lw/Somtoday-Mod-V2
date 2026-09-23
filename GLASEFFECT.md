# Glaseffect voor Somtoday Mod V2 (Chromium)

Deze fork voegt **Mod-instellingen → Glaseffect** toe. Schakel de
functie in, kies transparantie (0–100%) en vervaging (0–40 px), selecteer de
onderdelen en klik op **Opslaan**. De functie staat standaard uit. Als ze uit
staat, blijven de bestaande instellingen onder **Achtergrond** gelden.

**De bestaande UI-transparantie en UI-blur werken nu ook op volledige zijpanelen
en modals.** Je hoeft de nieuwe onderdeelschakelaars daarvoor niet aan te zetten.
Het desktoplesdetail heeft een buitenste `sl-sidebar > .content-container` én een
binnenste `sl-sidebar-page`: de buitenste laag krijgt het glaseffect en de binnenste
laag wordt transparant, zodat ook de lege ruimte onder de lesinformatie glas is.
Deze aanpassing geldt ook voor andere pagina's in hetzelfde type zijpaneel.

Ook het **Somtoday Mod-instellingenmenu** en de eigen mod-dialogen volgen nu
dezelfde transparantie en blur. Bij het glaseffect per onderdeel vallen ze onder
**Pop-ups, zijpanelen en Mod-menu**. Bij gebruik van de bestaande UI-schuifjes
doen ze automatisch mee. Een menu binnen een glaspaneel deelt de buitenste
blurlaag, zodat er geen extra ondoorzichtig vlak bovenop komt.

Er zijn twaalf groepen: overige panelen, rooster, huiswerk/studiewijzers, cijfers,
berichten, navigatie, headers/tabs, pop-ups/zijpanelen, detailvakken,
labels/icoonachtergronden, de donkere laag achter pop-ups en knoppen/invoervelden.
Een uitgeschakelde groep krijgt de oorspronkelijke achtergrondkleuren. De
kleuren voor bijvoorbeeld afspraken en afgerond huiswerk blijven behouden.
De nieuwe functie gebruikt ook het kleurenpalet van Night.

Het lesdetail ondersteunt nu ook de bovenstrook, titelbalk, omschrijving,
tijdlabels, docentlabels, icoonachtergronden en het achtergrondvlak van de
sluitknop. Extra lagen in de titelbalk en bovenstrook worden verwijderd zolang
het pop-upglaseffect actief is. De donkere laag achter pop-ups heeft een eigen
schakelaar die standaard uit staat; ook in Night behoudt die zo haar oorspronkelijke
sterkte. De kleuren van tekst, iconen en de vinkjes worden niet vervaagd.

## Lokaal laden

1. Exporteer eventueel je huidige Mod-instellingen vanuit Somtoday. Een lokaal
   geladen extensie heeft eigen opslag; instellingen worden niet vanzelf overgenomen.
2. Open `chrome://extensions` in Chrome/Helium of `edge://extensions` in Edge.
3. Zet de bestaande Somtoday Mod uit om dubbele exemplaren te voorkomen.
4. Zet ontwikkelaarsmodus aan en kies **Uitgepakte extensie laden**.
5. Kies de map `Chromium` uit de gedownloade of geclonede V2-repository.
6. Herlaad Somtoday, importeer zo nodig je instellingen en open **Glaseffect**.

Terugzetten: schakel de lokale extensie uit, zet het oorspronkelijke exemplaar
weer aan en herlaad Somtoday. De opslag van het oorspronkelijke exemplaar blijft
behouden als je het alleen uitschakelt.

Een achtergrondafbeelding maakt het effect zichtbaar. Transparantie verandert
alleen de achtergrondkleuren; tekst en iconen krijgen geen `opacity` of `filter`.
Geneste vlakken delen waar mogelijk één blurlaag. Vooruit geplaatste panelen
en afwijkende layouts moeten nog in de geïnstalleerde extensie worden nagekeken.

## Validatie

De componentnamen en achtergrondlagen van het actuele rooster, de studiewijzer,
het cijferoverzicht, berichten en account-/lesmodals zijn op Somtoday bekeken.
De aangepaste extensie is **nog niet geïnstalleerd of integraal op Somtoday getest**.
Niet bezochte pagina's en hardgecodeerde achtergronden kunnen extra selectors
nodig hebben; de CSS gebruikt de bestaande Somtoday-kleurvariabelen.

Lokale tests:

```sh
node --test tests/glass.test.cjs
python3 -m http.server 8766 --bind 127.0.0.1
```

Open `http://127.0.0.1:8766/tests/glass-preview.html` en kies **Voer controles uit**.
De testpagina bevat fictieve inhoud. De controles dekken afzonderlijke groepen,
lichte/donkere/Night-paletten, nul/maximale transparantie, blur, geneste vlakken,
dynamisch toegevoegde elementen en het uitschakelen van de functie.

Alleen de Chromium-versie is aangepast, conform de repository-richtlijnen.
Firefox, Android en het userscript zijn niet opnieuw gegenereerd.
