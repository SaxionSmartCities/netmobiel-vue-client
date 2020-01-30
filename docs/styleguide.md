# Style guide

Dit gidsje zit vol met zinnige voornamelijk design relateerde snippets om
ervoor te zorgen dat knoppen, header en menutjes een uniforme uitstraling krijgen
over de hele app.

## Back buttons
Onze app toont de backbutton altijd in de header.
Om de back button te tonen, roep tijdens het mounten aan dat je 
de back button wil tonen dmv.

```
 mounted() {
    this.$store.commit('ui/showBackButton')
  }
```

## Headers
Header zijn een beetje vervelend in Vuetify omdat ze qua
letter grootte heel erg dicht op elkaar zitten. Ondanks dat
zijn er echter wel een aantal verschilllen in padding en marge, Kies daarom
niet zomaar wat lukraak uit!

### H1
Deze heading gebruiken voor de bovenkant.

### H2
H2 wordt gebruikt op de tekstpagina's zoals de How-to als tussenkopjes

### H3
De gebruiken voor de titel van menu's etc. Zie bijv. het instellingenscherm (NotificationOptionsPage.vue)

### H4
Deze wordt gebruikt als de titel voor de cards en andere componenten.

#### Hoofdpagina H4
Deze gebruiker op de hoofdpagina in combinatie in uppercase en 'netmobiel' groen om de tussenkopjes te vormen zoals ze te zien zijn in het invision model


### H5, H6
Deze gebruiken we niet.

## Buttons

### Primary buttons
Knoppen voor acties die nodig zijn om tot de volgende stap in je huidige proces te komen.
```
<v-btn
    large
    rounded
    block
    depressed
    color="button"
    :disabled="disabledSubmit"
    @click="FUNCTIE OF ROUTERLINK"
    >
        Dit is een primaire actie!
    </v-btn>
```

### Secondary buttons
Knoppen voor acties die niet bijdragen
```
<v-btn 
    large 
    rounded 
    block 
    outlined 
    color="primary" 
    to="FUNCTIE OF ROUTERLINK"
    >
    Dit is een secundaire actie!
</v-btn>
```

