import { defineCustomElement } from 'vue'
import ('preline')

import EntityInfobox from './components/EntityInfobox.ce.vue'
import Footer from './components/Footer.ce.vue'
import Header from './components/Header.ce.vue'
import GIF from './components/GIF.ce.vue'
import Hero from './components/Hero.ce.vue'
import IFrame from './components/Hero.ce.vue'
// import Image from './components/Image.ce.vue'
import Manifest from './components/Manifest.ce.vue'
import ManifestPopup from './components/ManifestPopup.ce.vue'
import Map from './components/Map.ce.vue'
import MediaViewer from './components/MediaViewer.ce.vue'
import Menu from './components/Menu.ce.vue'
import Mermaid from './components/Mermaid.ce.vue'
import Meta from './components/Meta.ce.vue'
import Modal from './components/Modal.ce.vue'
import Navbar from './components/Navbar.ce.vue'
import PlantSpecimen from './components/PlantSpecimen.ce.vue'
import SiteSearch from './components/SiteSearch.ce.vue'
import Spacer from './components/Spacer.ce.vue'
import Trigger from './components/Trigger.ce.vue'

function defineCustomElements() {
	customElements.define('ve-entity-infobox', defineCustomElement(EntityInfobox))
	customElements.define('ve-footer', defineCustomElement(Footer))
	customElements.define('ve-gif', defineCustomElement(GIF))
	customElements.define('ve-header', defineCustomElement(Header))
	customElements.define('ve-hero', defineCustomElement(Hero))
	// customElements.define('ve-image', defineCustomElement(Image))
	customElements.define('ve-manifest', defineCustomElement(Manifest))
	customElements.define('ve-manifest-popup', defineCustomElement(ManifestPopup))
	customElements.define('ve-map', defineCustomElement(Map))
	customElements.define('ve-media', defineCustomElement(MediaViewer))
	customElements.define('ve-menu', defineCustomElement(Menu))
	customElements.define('ve-mermaid', defineCustomElement(Mermaid))
	customElements.define('ve-meta', defineCustomElement(Meta))
	customElements.define('ve-modal', defineCustomElement(Modal))
	customElements.define('ve-navbar', defineCustomElement(Navbar))
	customElements.define('ve-plant-specimen', defineCustomElement(PlantSpecimen))
	customElements.define('ve-site-search', defineCustomElement(SiteSearch))
	customElements.define('ve-spacer', defineCustomElement(Spacer))
	customElements.define('ve-trigger', defineCustomElement(Trigger))
};

// @ts-ignore
console.log(`${process.env.name}: version=${process.env.version}`)

defineCustomElements()
