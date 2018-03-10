/**
 * This module handles updating (local) board data when a card is moved. 
 * It returns a new array, the original is unmodified.
 * 
 * Updating local data prior to getting a server response is recommended in 
 * the "Synchronous reordering" section of the docs
 * https://github.com/atlassian/react-beautiful-dnd
 */

 class BoardUpdater {

	constructor(originalRows, idOfMovedCard) {
    if ((typeof originalRows === 'undefined') || (typeof idOfMovedCard === 'undefined')) {
      throw new Error("Expected originalRows and idOfMovedCard args");
    } 
    this.originalRows = originalRows;
    // Find original card + make a defensive copy of it
    const matchingCard = this.findOriginalCard(idOfMovedCard);
    this.originalCardDetails = Object.assign({}, matchingCard);
	}

  /** @return {Object} original card (not a copy) */
	findOriginalCard(cardId) {
    let match = null;
		this.originalRows.forEach((row) => {
			row.cells.forEach((cell) => {
				cell.cards.forEach((card) => {
					if (cardId === card.id) {
						match = card;
					}
				});
			});
    });
    if (match === null) {
      throw new Error("Couldn't find card with id " + cardId);
    } 
    return match;
	}

	/** 
   * @param {Object} movedCard with props id, rowId, colId, position
   */
  updateLocalRows(movedCard) {
    // Re-build rows
    const updatedRows = [];

    this.originalRows.forEach((row) => {
      const updatedRow = Object.assign({}, row);
      delete updatedRow.cells;

      // Re-build cells for each row
      const updatedCells = [];

      row.cells.forEach((cell) => {
        const updatedCell = {colId: cell.colId};

        // Re-build cards for each cell
        const updatedCards = this.initUpdatedCards(cell, row.id, movedCard);

        updatedCell.cards = updatedCards;
        updatedCells.push(updatedCell);
      }); // Cell loop

      updatedRow.cells = updatedCells;
      updatedRows.push(updatedRow);
    }); // Row loop

    return updatedRows;
  }

  initUpdatedCards(cell, rowId, movedCard) {
    if (cell.cards.length) {
      return this.initUpdatedCardsForNonEmptyCell(cell, rowId, movedCard);
    } else {
      return this.initUpdatedCardsForEmptyCell(cell, rowId, movedCard);
    }
  }

  initUpdatedCardsForNonEmptyCell(cell, rowId, movedCard) {
    const updatedCards = [];
    cell.cards.forEach((card) => {
      const updatedCard = Object.assign({}, card);

      if (this.isDestinationCell(rowId, cell.colId, movedCard)) {
        if ((updatedCards.length + 1) === movedCard.position) {
          // Insert moved card
          this.originalCardDetails.position = updatedCards.length + 1;
          updatedCards.push(this.originalCardDetails);

          // Re-add existing card (unless it's the moved card)
          if (card.id !== movedCard.id) {
            updatedCard.position = updatedCards.length + 1;
            updatedCards.push(updatedCard);
          }
        } else {
          if (movedCard.id === card.id) {
            // Skip (card is being moved within cell)  
          } else {
            updatedCard.position = updatedCards.length + 1;
            updatedCards.push(updatedCard);
          }
        }
      } else {  // Not the destination cell
        if (card.id === movedCard.id) {
          // Skip this card, it's been moved
        } else {
          updatedCard.position = updatedCards.length + 1;
          updatedCards.push(updatedCard);
        }
      }

      // If moved card is moved to the last position...
      if (this.isDestinationCell(rowId, cell.colId, movedCard) 
          && ((updatedCards.length + 1) === movedCard.position)) {
        this.originalCardDetails.position = updatedCards.length + 1;
        updatedCards.push(this.originalCardDetails);
      }
    });
    return updatedCards;
  }

  /** For when a card is moved to an empty cell */
  initUpdatedCardsForEmptyCell(cell, rowId, movedCard) {
    const updatedCards = [];
    if ((cell.colId === movedCard.colId) && (rowId === movedCard.rowId)) {
      this.originalCardDetails.position = updatedCards.length + 1;
      updatedCards.push(this.originalCardDetails);
    }
    return updatedCards;
  }

  isDestinationCell(rowId, colId, movedCard) {
    return ((colId === movedCard.colId) && (rowId === movedCard.rowId));
  }
}

module.exports = BoardUpdater;