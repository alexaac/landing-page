/**
 *
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 *
 * Dependencies: None
 *
 * JS Version: ES2015/ES6
 *
 * JS Standard: ESlint
 *
 */

/**
 * Define Global Variables
 *
 */

const sectionsList = document.getElementsByTagName("section");
const mainContent = document.querySelector("main");
const navigationMenuList = document.getElementById("navbar__list");

/**
 * End Global Variables
 * Start Helper Functions
 *
 */

/**
 * @description Create new menu item
 * @constructor
 * @param {Object} section - newly created section
 */
const createMenuItem = (section) => {
  const menuItem = document.createElement("li");
  const menuLink = document.createElement("a");

  menuLink.setAttribute("href", `#${section.id}`);
  menuLink.textContent = section.querySelector("h2").innerHTML;

  menuItem.appendChild(menuLink);

  return menuItem;
};

/**
 * @description Add menu item
 * @constructor
 * @param {Object} section - newly created section
 */
const addMenuItem = (section) => {
  const menuItem = createMenuItem(section);
  navigationMenuList.appendChild(menuItem);
};

/**
 * @description Remove menu item
 * @constructor
 * @param {Object} section - deleted section
 */
const removeMenuItem = (section) => {
  const menuLink = document.querySelector(`[href^="#${section.id}"]`);
  const menuItem = menuLink.parentElement;
  navigationMenuList.removeChild(menuItem);
};

/**
 * End Helper Functions
 * Begin Main Functions
 *
 */

// Build the navigation menu on page load

/**
 * @description Populate menu list from sections list on page load
 * @constructor
 * @param {Object} sectionsList - all sections on page
 */
const createMenuItems = (sectionsList) => {
  const tempList = document.createDocumentFragment();

  for (const section of sectionsList) {
    const menuItem = createMenuItem(section);

    tempList.append(menuItem);
  }

  return tempList;
};

/**
 * @description Update menu on section add/remove
 * @constructor
 * @param {Object} event - DOMNodeRemoved or DOMNodeInserted
 */
const updateMenuList = (event) => {
  const section = event.target;

  // check that the target node is a section
  if (section.id.match(/^section/i)) {
    if (event.type === "DOMNodeRemoved") {
      // remove existing menu item corresponding to deleted section
      removeMenuItem(section);
    } else if (event.type === "DOMNodeInserted") {
      // add menu item for added section
      addMenuItem(section);
    }
  }
};
// Add class 'active' to section when near top of viewport

// Scroll to anchor ID using scrollTO event

/**
 * End Main Functions
 * Begin Events
 *
 */

// Build menu
const tempItemsList = createMenuItems(sectionsList);
navigationMenuList.appendChild(tempItemsList);

// Dinamically update menu
mainContent.addEventListener("DOMNodeInserted", updateMenuList, false);
mainContent.addEventListener("DOMNodeRemoved", updateMenuList, false);

// Scroll to section on link click

// Set sections as active
