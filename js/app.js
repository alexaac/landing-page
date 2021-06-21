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

  const sectionsList = document.getElementsByTagName('section');
  const sectionsHeaderList = document.getElementsByTagName('h2');
  const mainContent = document.querySelector('main');
  const navigationMenuList = document.getElementById('navbar__list');
  const navigationMenu = document.querySelector('.navbar__menu');
  const topBtn = document.getElementById('top-btn');
  const addSectionButton = document.getElementById('add-btn');
  const removeLastSectionButton = document.getElementById('remove-btn');

  let isScrolling; // timeout variable for scroll event
  let prevPos = window.pageYOffset; // scrolling position - overwritable
  const initialPos = window.pageYOffset; // scrolling position
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
    const menuItem = document.createElement('li');
    const menuLink = document.createElement('a');

    menuLink.setAttribute('href', `#${section.id}`);
    menuLink.textContent = section.querySelector('h2').innerHTML;
    menuLink.className = 'menu__link';

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

    // use partial visibility check
    // https://stackoverflow.com/a/26039199

    const vertInView =
      position.top <= window.innerHeight && position.top + position.height >= 0;
    const horInView =
      position.left <= window.innerWidth && position.left + position.width >= 0;

    return vertInView && horInView;
  };

  /**
   * @description Create new section
   * @param {Object} sectionsCount - existing sections count
   */
  const addNewSection = (sectionsCount) => {
    // Get existing sections count
    const newId = sectionsCount + 1;

    // Create the section and its elements
    const section = document.createElement('section');
    const sectionDiv = document.createElement('div');
    const sectionHeader = document.createElement('h2');
    const sectionParagraph1 = document.createElement('p');
    const sectionParagraph2 = document.createElement('p');

    // Populate the sections elements with text, set class and id
    section.id = `section${newId}`;
    section.setAttribute('data-nav', `Section ${newId}`);
    sectionDiv.className = 'landing__container';
    sectionHeader.textContent = `Section ${newId}`;
    sectionParagraph1.textContent = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
      fermentum metus faucibus lectus pharetra dapibus. Suspendisse
      potenti. Aenean aliquam elementum mi, ac euismod augue. Donec eget
      lacinia ex. Phasellus imperdiet porta orci eget mollis. Sed
      convallis sollicitudin mauris ac tincidunt. Donec bibendum, nulla
      eget bibendum consectetur, sem nisi aliquam leo, ut pulvinar quam
      nunc eu augue. Pellentesque maximus imperdiet elit a pharetra. Duis
      lectus mi, aliquam in mi quis, aliquam porttitor lacus. Morbi a
      tincidunt felis. Sed leo nunc, pharetra et elementum non, faucibus
      vitae elit. Integer nec libero venenatis libero ultricies molestie
      semper in tellus. Sed congue et odio sed euismod.`;
    sectionParagraph2.textContent = `Aliquam a convallis justo. Vivamus venenatis, erat eget pulvinar
      gravida, ipsum lacus aliquet velit, vel luctus diam ipsum a diam.
      Cras eu tincidunt arcu, vitae rhoncus purus. Vestibulum fermentum
      consectetur porttitor. Suspendisse imperdiet porttitor tortor, eget
      elementum tortor mollis non.`;
    sectionHeader.textContent = `Section ${sectionsCount + 1}`;

    // Append the title and paragraphs to the section div
    sectionDiv.appendChild(sectionHeader);
    sectionDiv.appendChild(sectionParagraph1);
    sectionDiv.appendChild(sectionParagraph2);

    // Append the section div to the section
    section.appendChild(sectionDiv);

    // Collapse sections
    sectionHeader.addEventListener('click', (event) => {
      toggleSectionCollapse(event);
    });

    // Add event listener for active class
    document.addEventListener('scroll', () => {
      toggleSectionActive(section);
    });

    return section;
  };

  /**
   * End Helper Functions
   * Begin Main Functions
   *
   */

  /**
   * @description Populate menu list from sections list on page load
   * @param {Object} sectionsList - all sections on page
   */
  const createMenuItems = (sectionsList) => {
    const tempList = document.createDocumentFragment();

    [...sectionsList].forEach((section) => {
      const menuItem = createMenuItem(section);

      tempList.append(menuItem);
    });

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
      if (event.type === 'DOMNodeRemoved') {
        // remove existing menu item corresponding to deleted section
        removeMenuItem(section);
      } else if (event.type === 'DOMNodeInserted') {
        // add menu item for added section
        addMenuItem(section);
      }
    }
  };

  /**
   * @description Add class 'active' to the section in viewport
   * @param {Object} event - scroll
   */
  const toggleSectionActive = (section) => {
    const menuLink = document.querySelector(`[href^="#${section.id}"]`);

    if (menuLink !== null) {
      if (isSectionInViewport(section)) {
        section.classList.add('your-active-class');
        menuLink.classList.add('link-active-class');
      } else {
        section.classList.remove('your-active-class');
        menuLink.classList.remove('link-active-class');
      }
    }
  };

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
      behavior: 'smooth',
    });
  };

  /**
   * @description Hide navigation menu when user stops scrolling
   */
  const toggleNavigationMenu = () => {
    const currentPos = window.pageYOffset;

    // Clear timeout when scrolling
    window.clearTimeout(isScrolling);

    // Show menu while scrolling
    navigationMenu.classList.remove('hide-top');

    // Set timeout to run after scrolling ends
    isScrolling = setTimeout(function () {
      // Hide menu while not scrolling
      navigationMenu.classList.add('hide-top');

      if (prevPos > currentPos) {
        // Show menu while scrolling up
        navigationMenu.classList.remove('hide-top');
      }

      prevPos = currentPos;
    }, 66);
  };

  /**
   * @description Scroll to top button
   */
  const toggleScrollToTopButton = () => {
    const currentPos = window.pageYOffset;

    if (currentPos - initialPos > window.innerHeight) {
      topBtn.classList.remove('hide-right');
    } else {
      topBtn.classList.add('hide-right');
    }
  };

  /**
   * @description Collapse section on click
   * @param {Object} section - section
   */

  const toggleSectionCollapse = (event) => {
    const sectionHeader = event.target;
    sectionHeader.classList.toggle('active');

    const section = sectionHeader.parentElement;

    const paragraphs = section.querySelectorAll('p');

    paragraphs.forEach((paragraph) => {
      paragraph.classList.toggle('hide');
    });
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
  mainContent.addEventListener('DOMNodeInserted', updateMenuList);
  mainContent.addEventListener('DOMNodeRemoved', updateMenuList);

  // Set sections as active
  [...sectionsList].forEach((section) => {
    document.addEventListener('scroll', () => {
      toggleSectionActive(section);
    });
  });

  // Scroll to section on link click
  let anchorsList = document.querySelectorAll('a[href^="#section"]');
  anchorsList.forEach((anchor) => {
    anchor.addEventListener('click', scrollToSection);
  });

  // Hide fixed navigation bar while not scrolling
  // Show navigation on page load and when scrolling up
  document.addEventListener('unload', () => {
    navigationMenu.classList.remove('hide-top');
  });

  document.addEventListener('scroll', () => {
    toggleNavigationMenu();
  });

  // Scroll to top button
  topBtn.classList.add('hide-right');
  document.addEventListener('scroll', () => {
    toggleScrollToTopButton();
  });

  // Collapse sections
  [...sectionsHeaderList].forEach((sectionHeader) => {
    sectionHeader.addEventListener('click', (event) => {
      toggleSectionCollapse(event);
    });
  });

  // Add section on button click
  addSectionButton.onclick = () => {
    // Get last section or another element to insert after
    let insertAfterThis = sectionsList[sectionsList.length - 1];
    if (insertAfterThis !== undefined) {
    } else {
      insertAfterThis = document.getElementById('a-top');
    }

    // Create new section
    const section = addNewSection(sectionsList.length);

    // Append  new section after the last section
    insertAfterThis.insertAdjacentElement('afterend', section);
  };

  // Remove section on button click
  removeLastSectionButton.onclick = () => {
    // Get last section
    const lastSection = sectionsList[sectionsList.length - 1];

    if (lastSection) {
      // Remove this element
      lastSection.remove();
    }
  };

  // Test performance end
  const endTime = performance.now();
};

// Run main function on DOMContentLoaded
// Running the function in the head increases the performance
document.addEventListener('DOMContentLoaded', function () {
  main();
});
