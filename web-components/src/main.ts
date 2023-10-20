// import './tailwind.css'
import { defineCustomElement } from 'vue'
import ('preline')

import EntityInfobox from './components/EntityInfobox.ce.vue'
import Header from './components/Header.ce.vue'
import Hero from './components/Hero.ce.vue'
import Image from './components/Image.ce.vue'
import Menu from './components/Menu.ce.vue'
import Meta from './components/Meta.ce.vue'
import Modal from './components/Modal.ce.vue'
import Navbar from './components/Navbar.ce.vue'
import Trigger from './components/Trigger.ce.vue'

function defineCustomElements() {
	customElements.define('ve-entity-infobox', defineCustomElement(EntityInfobox))
	customElements.define('ve-header', defineCustomElement(Header))
	customElements.define('ve-hero', defineCustomElement(Hero))
	customElements.define('ve-image', defineCustomElement(Image))
	customElements.define('ve-menu', defineCustomElement(Menu))
	customElements.define('ve-meta', defineCustomElement(Meta))
	customElements.define('ve-modal', defineCustomElement(Modal))
	customElements.define('ve-navbar', defineCustomElement(Navbar))
	customElements.define('ve-trigger', defineCustomElement(Trigger))
};

// @ts-ignore
console.log(`wc: version=${process.env.version}`)

defineCustomElements()
