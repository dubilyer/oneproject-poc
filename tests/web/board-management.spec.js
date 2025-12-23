import { test } from '@playwright/test';
import { BoardsPage } from '../../pom/BoardsPage.js';
import { BoardDataFactory } from '../../data/BoardDataFactory.js';

test.describe('Board Management', () => {
  test('User can create and delete a board', async ({ page }) => {
    const boardsPage = new BoardsPage(page);
    const boardData = BoardDataFactory.buildUniqueBoard();
    
    await boardsPage.createBoard(boardData.boardName, boardData.projectName);
    await boardsPage.deleteBoard(boardData.boardName);
    await boardsPage.verifyBoardNotVisible(boardData.boardName);
  });
});
