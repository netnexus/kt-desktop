# kt-desktop

kt-desktop is an (unofficial) open source desktop software for your bank account from [Kontist](https://kontist.com/).

## Binaries 
Windows: [Download](https://netnexus.de/kt-desktop/latest-win)

Mac: [Download](https://netnexus.de/kt-desktop/latest-mac)

Linux: [Download](https://netnexus.de/kt-desktop/latest-linux)

## Build from source

Use npm to install the dependencies for kt-desktop.
You also need Angular CLI.

```bash
npm install
npm install -g @angular/cli
```

## Usage

```bash
npm start
```

## Functions

### Transaction list
This list provides a filter to quickly find the transaction you are looking for.

![bankTransfer](docs/assets/bankTransfer.jpg?raw=true "bankTransfer")


### Create new transfers
Name and IBAN fields with autocomplete function

![bankTransferForm](docs/assets/bankTransferForm.jpg?raw=true "create transfer")


### Standing orders
View and edit your standing orders.

![standingOrder](docs/assets/standingorder.jpg?raw=true "standing order list")

![standingOrderForm](docs/assets/standingorderForm.jpg?raw=true "create standing order")


### Export
Export your transactions to JSON, QIF or CSV.

![standingOrder](docs/assets/export.jpg?raw=true "Export")
