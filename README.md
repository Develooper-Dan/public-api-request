# "Employee" gallery with public api request

 This little app uses asynchronous JavaScript-programming to showcase a gallery of random employees/users/members along with some basic informations like name, adress etc. in a card-format. A search bar adds the possbility to filter for one or more persons via first/last name. The user can also click on one of the cards to get more detailed infos about the person which is then presented via a modal which pops up.

 The layout of the document as well as some predefined styling was provided by Team Treehouse.

### Main mechanics and functionality
- First, the data which contains all the information about 12 "person-objects" is retrieved asynchronously by a fetch-call to the randomuser.me api. It is parsed from JSON-format and then stored in a variable. For better handling and performance, the attributes of the person-objects are reduced and formatted by .map()
- Two async functions are used to create the gallery and eventually modals (the latter being only created if the user clicks on a gallery item). They both use template literals to create an HTML-string where the received data is used in embedded expressions and then insert it in the appropriate DOM-Element.
- The modals feature a "close"-button which removes the modal from the DOM. They also have two buttons (except for the first and last gallery item) to cycle directly through the modals of the corresponding person-objects, stopping at the first/last item respectively. This function also takes into account the cards which were hidden due to a previous search via the search bar
- The user gets an error message if the API-request fails for whatever reason and also if no search results are found

### Styling
In my view, the provided style felt a bit too sterile, so I made the following additions/changes:

- The background color was changed to a dark-blue image of cube shapes which contrasts nicely with the light-greyish cards
- The heading was made a bit more prominent and the color was adjusted to fit the yellow-orange glowing cube
- Names now have a custom font found on the web which resembles handwritten-style to look a bit more "personal"
- An upscaling transform effect was added on hovering over a card
- Instead of just popping up immediately, the modals are blurred in
