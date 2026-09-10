# Sprint 2 – Phase 7: ROI Calculator Specification

## 1. Ziel und Scope
Der ROI Calculator dient dazu, potenziellen Kunden (Tuningbetrieben) den wirtschaftlichen Nutzen der TunerPortal-Softwarelösung transparent, nachvollziehbar und seriös aufzuzeigen. 
Er berechnet auf Basis von Benutzereingaben realistische Schätzungen zu Zeit- und Kostenersparnissen. 
Der Rechner generiert **keine** unbelegten Umsatzversprechen, erfindet keine Kosteneinsparungen und nutzt keine fiktiven Branchen-Benchmarks als garantierte Annahmen. Ziel ist es, dem Kunden fundierte Entscheidungsgrundlagen (Business Case) für den Softwarekauf zu liefern, wobei rechtliche und fachliche Disclaimer stets eine reine Schätzung verdeutlichen.

## 2. Zielgruppen
Der Rechner ist in Version 1 primär konzipiert für:
* **Kleine bis mittlere Tuningbetriebe (File Services, B2C/B2B-Werkstätten)**, die manuelle Prozesse durch TunerPortal automatisieren möchten.
* **Enterprise-Kunden**, die eine formelle Wirtschaftlichkeitsberechnung für ihr Management benötigen.

Unterschiedliche Berechnungsmodelle (z.B. für reine Reseller oder White-Label-Partner) werden in Version 1 nicht abgebildet, da diese stärker provisions- und volumenbasiert sind und eine abweichende betriebswirtschaftliche Logik erfordern.

## 3. Berechnungsmodi
In Version 1 wird ein stark konservatives Modell priorisiert:
* **"time_and_cost_savings"** (Kombinierter Modus aus Zeit- und Kostenersparnis).
* Spätere Modi (wie `revenue_opportunity` oder `capacity_gain`) erfordern zu viele ungesicherte Annahmen (z. B. "Gibt es genug Nachfrage für die freigewordene Zeit?") und sind in Version 1 deaktiviert.

## 4. Eingabemodell (Inputs)
Alle Werte müssen vom Benutzer definiert werden. Es gibt keine "erfundenen" Defaults.

| ID | Fachliche Bezeichnung | Datentyp | Einheit | Min | Max | Default | Quelle | Required |
|---|---|---|---|---|---|---|---|---|
| `ordersPerMonth` | Aufträge pro Monat | Integer | Aufträge | 1 | 10.000 | (leer) | User | Ja |
| `timePerOrderMinutes` | Aktuelle Bearbeitungszeit | Integer | Minuten | 1 | 1.440 | (leer) | User | Ja |
| `expectedTimeSavingsMinutes` | Erwartete Zeitersparnis | Integer | Minuten | 1 | `timePerOrder` | (leer) | User | Ja |
| `hourlyLaborCost` | Personalkosten (Vollkosten) | Minor Unit | Währung | 100 | 50.000 | (leer) | User | Ja |
| `tunerPortalMonthlyCost` | TunerPortal Kosten | Minor Unit | Währung | 0 | - | Pricing Engine | System | Ja |
| `onboardingCost` | Einmalige Einführungskosten | Minor Unit | Währung | 0 | - | Pricing Engine | System | Ja |

## 5. Ausgabemodell (Outputs)
Jede Ausgabe besitzt eine ID, eine Einheit und ist klar als "Schätzung" gekennzeichnet.

* **`monthlySavedMinutes`**: Monatlich eingesparte Zeit (Minuten)
* **`yearlySavedHours`**: Jährlich eingesparte Zeit (Stunden)
* **`yearlyLaborCostSavings`**: Geschätzter Arbeitswert der Zeitersparnis pro Jahr (Währung)
* **`yearlyPlatformCost`**: Jährliche Plattformkosten (Währung)
* **`yearlyNetEffect`**: Jährlicher Nettoeffekt (Währung)
* **`roiPercentage`**: ROI in Prozent (%)
* **`breakEvenMonths`**: Break-even in Monaten

## 6. Mathematische Formeln
Alle Formeln basieren auf gesicherten Eingaben.

**Zeitersparnis:**
* `monthlySavedMinutes` = `ordersPerMonth` × `expectedTimeSavingsMinutes`
* `monthlySavedHours` = `monthlySavedMinutes` / 60
* `yearlySavedHours` = `monthlySavedHours` × 12

**Kostenersparnis:**
* `yearlyLaborCostSavings` = `yearlySavedHours` × `hourlyLaborCost`

**Plattformkosten:**
* `yearlyPlatformCost` = `tunerPortalMonthlyCost` × 12

**Nettoeffekt:**
* `yearlyNetEffect` = `yearlyLaborCostSavings` - `yearlyPlatformCost` - `onboardingCost` 
*(Annahme: Onboarding wird im ersten Jahr vollständig berücksichtigt. Alternativ: annualisiert über z.B. 3 Jahre – für Version 1 wird das erste Jahr betrachtet)*

**ROI-Prozent:**
* `totalInvestment` = `yearlyPlatformCost` + `onboardingCost`
* `roiPercentage` = (`yearlyNetEffect` / `totalInvestment`) × 100

**Break-even:**
* `monthlyNetBenefit` = (`yearlyLaborCostSavings` / 12) - `tunerPortalMonthlyCost`
* `breakEvenMonths` = `onboardingCost` / `monthlyNetBenefit` (sofern `monthlyNetBenefit` > 0)

## 7. Einheiten & Währungsstrategie
* **Zeit**: Basis intern sind immer Minuten. Ausgabe erfolgt formatiert in Minuten oder Stunden.
* **Geld**: Basis intern sind Minor Units (z. B. Cent) als Integer. Keine Fließkommazahlen (Floats) für Geld! Multiplikationen erfolgen auf Basis von Minor Units.
* **Währung**: Ein Calculator-Durchlauf verwendet exakt eine Währung. Keine automatische Währungsumrechnung.

## 8. Rundungsregeln
* **Geldbeträge**: Nach kaufmännischer Rundung auf die konfigurierte Fraction-Digit der jeweiligen Währung.
* **Stunden/Prozentwerte**: Auf eine Nachkommastelle genau (z. B. 12,5 %).
* **Auftragszahlen/Break-even**: Kaufmännisches Runden auf volle Zahlen (Break-even Monate werden auf den nächsten vollen Monat aufgerundet via `Math.ceil()`).
* Die Berechnung erfolgt exakt in Minor Units, gerundet wird ausschließlich für die Anzeige.

## 9. Locale-Strategie
* Berechnungslogik (Domain) ist 100% Locale-agnostisch.
* **Präsentation**: Formatierung (Tausendertrennzeichen, Dezimalkomma/punkt, Währungssymbol) erfolgt strikt in der Präsentationsschicht (`Intl.NumberFormat`).

## 10. Fehlerfälle & Division durch null
* **Investitionskosten = 0**: Führt bei ROI-Prozent zur Ausgabe `not_applicable` (Vermeidung von `Infinity`).
* **Monatlicher Nettonutzen <= 0**: Break-even wird mit `no_break_even` klassifiziert.
* Ungültige Eingaben führen zu einem Status `invalid` mit Zod-validierten Fehler-Arrays, kein Werfen von Exceptions!

## 11. Negative Ergebnisse
* Negative ROI oder negative Nettoeffekte werden schonungslos rot bzw. sachlich korrekt als negative Zahl dargestellt (z. B. "- 1.200 € / Jahr"). Sie werden nicht versteckt.

## 12. Warnungen
Strukturierte Warnungen (Warnings-Array) im Output:
* `user_supplied_estimate`: "Ergebnisse basieren auf Ihren eigenen Eingaben."
* `excludes_tax`: "Die Berechnung versteht sich netto zzgl. der gesetzlichen Steuern."
* `capacity_not_revenue`: "Eingesparte Zeit bedeutet nicht zwingend mehr Umsatz, sofern diese nicht für neue Aufträge genutzt werden kann."

## 13. Disclaimer
Mindestens folgende Disclaimer werden lokalisiert über die Content-Engine geladen:
1. "Bei diesen Berechnungen handelt es sich um reine Schätzungen, nicht um garantierte Einsparungen."
2. "Die tatsächlichen Werte können je nach individuellem Betriebsablauf und Marktlage abweichen."
3. "Steuerliche Auswirkungen sind nicht berücksichtigt."

## 14. Datenquellen & Publishability
* System-Kosten stammen exklusiv aus der Pricing Engine (Repository).
* Der Calculator darf öffentlich **nur** gerendert werden, wenn alle benötigten Pricing-Referenzen geladen werden können, alle Disclaimer-Texte vorliegen (Status `published`) und keine inkonsistenten Währungen konfiguriert sind.

## 15. Datenschutz & Analytics
* **Datenschutz**: Keine Eingabewerte werden im Local Storage gespeichert. Es findet keine Übertragung an CRM oder Server-Datenbanken statt. Alles bleibt Client-State.
* **Analytics**: Nur aggregierte Events (`calculator_viewed`, `calculation_completed`) ohne konkrete Geldbeträge oder Auftragszahlen.

## 16. Accessibility & SEO
* **A11y**: Verzicht auf "on-the-fly" Fokuswechsel. Resultate erhalten ein `aria-live="polite"`. Eingabefelder haben klare, sichtbare Labels inkl. Einheiten (z. B. "€/Std.").
* **SEO**: Die Seite wird indexiert, aber ohne URL-Parameter der Ergebnisse. Resultate werden nicht serverseitig als Thin-Content pre-rendered.

## 17. Testspezifikation (Testfälle)
1. **Basisfall**: Aufträge=100, Zeitersparnis=10 Min, Lohnkosten=50€/h -> Saved=200h/Jahr. Wert=10.000€/Jahr.
2. **Keine Ersparnis**: Zeitersparnis=0 -> ROI=negativ, Break-even=`no_break_even`.
3. **Kosten=0**: TunerPortal-Kosten=0, Onboarding=0 -> ROI=`not_applicable`.
4. **Validation**: Negative Auftragszahlen oder Arbeitslöhne -> Zod Error `above_minimum`.

## 18. Risiken
* Ungenauigkeit bei Lohnkosten (Brutto vs. Vollkosten).
* Nutzer verstehen "gewonnene Zeit" oft als "zusätzliches Geld auf dem Konto", was fachlich falsch ist, wenn das Personal ohnehin fest angestellt ist und bezahlt wird. (Daher starke Warnungen).

## 19. Offene Entscheidungen & Empfehlung für Version 1

1. **Berechnungsmodi**: Empfehlung V1: Ausschließlich `time_and_cost_savings`.
2. **Kostenersparnis vs. Umsatzpotenzial**: Empfehlung V1: Strikt nur "geschätzter Arbeitswert der Zeitersparnis". Kein Umsatzpotenzial.
3. **Szenarien**: Empfehlung V1: Keine automatischen Szenarien. Nur eine exakte, benutzerdefinierte Berechnung.
4. **Defaults**: Empfehlung V1: Keine System-Defaults für Nutzerwerte.
5. **Eingabepflicht**: Alle User-Inputs sind required.
6. **Zeitraum**: Empfehlung V1: 1 Jahr Betrachtungszeitraum für Nettoeffekt und ROI.
7. **Pricing**: Onboarding-Kosten werden in voller Höhe dem 1. Jahr abgezogen.
8. **Speicherung**: Keine Speicherung von Eingaben in Version 1.

---
**Status**: `draft` - Wartet auf Freigabe zur Implementierung.
