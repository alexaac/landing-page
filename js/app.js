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

// Main function
const main = () => {
  // Test performance start
  const startTime = performance.now();

  /**
   * Define Global Variables
   *
   */

  const sectionsList = document.getElementsByTagName("section");
  const mainContent = document.querySelector("main");
  const navigationMenuList = document.getElementById("navbar__list");
  const navigationMenu = document.querySelector(".navbar__menu");

  /**
   * End Global Variables
   * Start Helper Functions
   *
   */

  /**
   * @description Create new menu item
   * @param {Object} section - newly created section
   */
  const createMenuItem = (section) => {
    const menuItem = document.createElement("li");
    const menuLink = document.createElement("a");

    menuLink.setAttribute("href", `#${section.id}`);
    menuLink.textContent = section.querySelector("h2").innerHTML;
    menuLink.className = "menu__link";

    menuItem.appendChild(menuLink);

    return menuItem;
  };

  /**
   * @description Add menu item
   * @param {Object} section - newly created section
   */
  const addMenuItem = (section) => {
    const menuItem = createMenuItem(section);
    navigationMenuList.appendChild(menuItem);
  };

  /**
   * @description Remove menu item
   * @param {Object} section - deleted section
   */
  const removeMenuItem = (section) => {
    const menuLink = document.querySelector(`[href^="#${section.id}"]`);
    const menuItem = menuLink.parentElement;
    navigationMenuList.removeChild(menuItem);
  };

  /**
   * @description Check the current section is in the viewport
   * @param {Object} section - current section
   */
  const isSectionInViewport = (section) => {
    const position = section.getBoundingClientRect();

    // for our purpose, use fully visible check
    // position.top >= 0 && position.bottom <= window.innerHeight
    return position.top >= 0 && position.bottom <= window.innerHeight;
  };

  /**
   * End Helper Functions
   * Begin Main Functions
   *
   */

  // Build the navigation menu on page load

  /**
   * @description Populate menu list from sections list on page load
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

  /**
   * @description Add class 'active' to the section in viewport
   * @param {Object} event - scroll
   */
  const toggleSectionActive = (section) => {
    const menuLink = document.querySelector(`[href^="#${section.id}"]`);

    if (isSectionInViewport(section)) {
      section.classList.add("your-active-class");
      menuLink.classList.add("link-active-class");
    } else {
      section.classList.remove("your-active-class");
      menuLink.classList.remove("link-active-class");
    }
  };

  // Scroll to anchor ID using scrollTO event

  /**
   * @description Scroll to section on menu click
   * @param {Object} event - click
   */
  const scrollToSection = (event) => {
    const anchor = event.target;

    // Prevent clicking default behaviour
    event.preventDefault();

    // Get the section
    let section = document.querySelector(anchor.hash);

    // Scroll to section
    section.scrollIntoView({
      behavior: "smooth",
    });
  };

  // Hide navigation menu when user stops scrolling

  let isScrolling; // timeout variable
  let prevPos = window.pageYOffset; // scrolling position

  /**
   * @description Hide navigation menu when user stops scrolling
   */
  const hideNavigationMenu = () => {
    const currentPos = window.pageYOffset;

    // Clear timeout when scrolling
    window.clearTimeout(isScrolling);

    // Show menu while scrolling
    navigationMenu.classList.remove("hide");

    // Set timeout to run after scrolling ends
    isScrolling = setTimeout(function () {
      // Hide menu while not scrolling
      navigationMenu.classList.add("hide");

      if (prevPos > currentPos) {
        // Show menu while scrolling up
        navigationMenu.classList.remove("hide");
      }

      prevPos = currentPos;
    }, 66);
  };

  /**
   * End Main Functions
   * Begin Events
   *
   */

  // Build menu
  const tempItemsList = createMenuItems(sectionsList);
  navigationMenuList.appendChild(tempItemsList);

  // Dinamically update menu
  mainContent.addEventListener("DOMNodeInserted", updateMenuList);
  mainContent.addEventListener("DOMNodeRemoved", updateMenuList);

  // Set sections as active

  for (const section of sectionsList) {
    document.addEventListener("scroll", () => {
      toggleSectionActive(section);
    });
  }

  // Scroll to section on link click

  // Make a list of anchor links
  let anchorsList = document.querySelectorAll('a[href^="#"]');

  for (const anchor of anchorsList) {
    anchor.addEventListener("click", scrollToSection);
  }

  // Hide fixed navigation bar while not scrolling
  // Show navigation on page load and when scrolling up
  // Use addEventListener instead of .onunload to allow more
  // functions in the future
  document.addEventListener("unload", () => {
    navigationMenu.classList.remove("hide");
  });

  document.addEventListener("scroll", () => {
    hideNavigationMenu();
  });

  // Test performance end
  const endTime = performance.now();
  console.log("Time to run: " + (endTime - startTime) + " milliseconds.");
};

// Run main function on DOMContentLoaded
// Running the function in the head increases the performance
document.addEventListener("DOMContentLoaded", function () {
  main();
});
