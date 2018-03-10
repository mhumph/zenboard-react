const BoardUpdater = require('../../src/lib/BoardUpdater');
const assert  = require('assert');
const expect  = require('chai').expect;

const row1 = {id:1, title:'Row1', position:1, description:'Desc1', cells:[
	{colId:1, cards:[]},
	{colId:2, cards:[
		{id:1, title: 'Card1'}
	]},
	{colId:3, cards:[
		{id:99, title: 'Card99'}
	]}
]};

const row2 = {id:2, title:'Row2', position:2, description:'Desc2', cells:[
	{colId:1, cards:[
		{id:2, title: 'Card2'}
	]},
	{colId:2, cards:[
		{id:3, title: 'Card3'},
		{id:4, title: 'Card4'}
	]},
	{colId:3, cards:[]}
]};

const originalRows = [row1, row2];

// TODO: Make tests more readable 

describe('initUpdatedCards', () => {
	it('Cell that was empty but card moved into it', () => {
		const movedCard = {id: 1, rowId: 1, colId: 1, position: 1};

		const updater = new BoardUpdater([row1], movedCard.id);
		const cards = updater.initUpdatedCardsForEmptyCell(row1.cells[0], row1.id, movedCard);
		expect(cards.length).to.equal(1);
	})

	it('Cell that had one card but the card has been moved out', () => {
		const movedCard = {id: 2, rowId: 99, colId: 99, position: 1};
		const rowIdOfTestCell = 2;

		const updater = new BoardUpdater([row2], movedCard.id);
		const cards = updater.initUpdatedCardsForNonEmptyCell(row2.cells[0], rowIdOfTestCell, movedCard);
		expect(cards).to.have.lengthOf(0);
	})

	it('Cell that had one card and another card is moved above', () => {
		const movedCard = {id: 3, rowId: 2, colId: 1, position: 1};
		const rowIdOfTestCell = 2;

		const updater = new BoardUpdater([row2], movedCard.id);
		const cards = updater.initUpdatedCardsForNonEmptyCell(row2.cells[0], rowIdOfTestCell, movedCard);
		expect(cards).to.have.lengthOf(2);
		expect(cards[0].id).to.equal(3);
		expect(cards[1].id).to.equal(2);
	})

	it('Cell that had one card, then another card is moved below', () => {
		const movedCard = {id: 1, rowId: 1, colId: 3, position: 2};
		const rowIdOfTestCell = 1;

		const updater = new BoardUpdater([row1], movedCard.id);
		const cards = updater.initUpdatedCardsForNonEmptyCell(row1.cells[2], rowIdOfTestCell, movedCard);
		expect(cards).to.have.lengthOf(2);
		expect(cards[0].id).to.equal(99);
		expect(cards[1].id).to.equal(1);
	})

	it("Cell with one card that isn't effected by move", () => {
		const movedCard = {id: 99, rowId: 99, colId: 99, position: 99};
		const rowIdOfTestCell = 1;

		const updater = new BoardUpdater([row1], movedCard.id);
		const cards = updater.initUpdatedCardsForNonEmptyCell(row1.cells[1], rowIdOfTestCell, movedCard);
		expect(cards).to.have.lengthOf(1);
		expect(cards[0].id).to.equal(1);
	})

})

describe('BoardUpdater', () => {
	it('findOriginalCard', () => {
		const idOfMovedCard = 3;
		const updater = new BoardUpdater([row2], idOfMovedCard);
		expect(updater.originalCardDetails).to.exist;
		expect(updater.originalCardDetails.id).to.equal(3);
	});

	it('Move card to empty cell', () => {
		const idOfMovedCard = 1;
		const movedCard = {id: 1, rowId: 1, colId: 1, position: 1};

		const updater = new BoardUpdater([row1], idOfMovedCard);
		const result = updater.updateLocalRows(movedCard);

		expect(result[0].cells[0].cards.length).to.equal(1);
		expect(result[0].cells[0].cards[0].id).to.equal(1);

		expect(result[0].cells[1].cards.length).to.equal(0);
		expect(result[0].cells[2].cards.length).to.equal(1);
	});

	it('Move card to non-empty cell', () => {
		const idOfMovedCard = 3;
		const movedCard = {id: 3, rowId: 2, colId: 1, position: 1};

		const updater = new BoardUpdater([row2], idOfMovedCard);
		const result = updater.updateLocalRows(movedCard);

		expect(result[0].cells[0].cards.length).to.equal(2);
		expect(result[0].cells[0].cards[0].id).to.equal(3);

		expect(result[0].cells[1].cards.length).to.equal(1);
	});

	it("Cell with two cards, swap the order of the cards", () => {
		const idOfMovedCard = 3;
		const movedCard = {id: 3, rowId: 2, colId: 2, position: 2};

		const updater = new BoardUpdater([row2], idOfMovedCard);
		const result = updater.updateLocalRows(movedCard);

		expect(result[0].cells[1].cards.length).to.equal(2);
		expect(result[0].cells[1].cards[0].id).to.equal(4);
		expect(result[0].cells[1].cards[1].id).to.equal(3);

		expect(result[0].cells[0].cards.length).to.equal(1);
		expect(result[0].cells[2].cards.length).to.equal(0);
	});

});