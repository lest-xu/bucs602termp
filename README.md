# X Grocery Store - Term Project - CS602

This README.md file provides an overview of the assignments functionality implemented for term project Li Xu- CS602 S2 2024.
A shopping cart application for a grocery online store, a customer will be able to add products into cart and checkout, an admin can manage a list of products and view/modify the customer's orders.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [File Structure](#file-structure)


## Technologies Used

- JavasScript
- Express.js
- Handlebars.js 
- mongoose.js 
- Node.js
- Bootstrap CSS 4.X

## Getting Started

### Prerequisites

- Node.js installed on your machine. You can download and install Node.js from [here](https://nodejs.org/en/download).

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/lest-xu/bucs602termp.git

2. Navigate to the project directory:

   ```sh
   cd yourrepo/bucs602termp

3. Install the libraries:

   ```sh
   npm install

### Running the Application

1. Run the JavasSript code:

   ```sh
   node server.js
   ```

Then open the link http://localhost:3000 in your browser.

## File Structure

The project directory contains the following files:

```
    bucs602a1/
         constollers/
            ── adminController.js
            ── apiController.js
            ── cartController.js
            ── storeController.js
         node_modules/
         public/
            images/
               ── store-logo.gif
            javascripts/
               ── clickActions.js
            stylesheets/
               ── bootstrap.css
               ── styles.css
         routes/
            ── index.js
         views/
            customer/
               ── viewCustomerDetails.handlebars
            layouts/
               ── main.handlebars
            order/
               ── displayProductsView.handlebars
               ── editProductView.handlebars
            product/
               ── addProductView.handlebars
               ── deleteProductView.handlebars
               ── editProductView.handlebars
               ── viewProductDetails.handlebars
            ── 404.handlebars
            ── cartView.handlebars
            ── checkoutView.handlebars
            ── displayAdminView.handlebars
            ── displayStoreView.handlebars
            ── orderHistoryView.handlebars
         ── connection_test.js
         ── credentials.js
         ── customerDB.js
         ── initDB.js
         ── orderDB.js
         ── package-lock.json
         ── package.json
         ── productDB.js
         ── README.md
         ── server.js
