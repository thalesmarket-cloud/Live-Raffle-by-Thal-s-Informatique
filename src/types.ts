/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Participant {
  id: string;
  name: string;
  email?: string;
  department?: string;
  company?: string;
}

export interface RaffleState {
  participants: Participant[];
  winners: Participant[];
  isDrawing: boolean;
  currentWinner: Participant | null;
}
