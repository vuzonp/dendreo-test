/**
 * Manages the relation between participants and slots.
 */
export class SlotsManager {
  #data = new Map();
  #listeners = [];
  #participants = new Set();

  /**
   * @param {Map<string, Set<string>>} slots
   */
  constructor(slots) {
    this.#data = slots;
    const pmk = this.getParticipantsMap().keys();
    for (const participantId of pmk) {
      this.#participants.add(participantId);
    }
  }

  /** Subscribes a participant to a slot.
   * @param {string} slotId
   * @param {string} participantId
   */
  subscribe(slotId, participantId) {
    if (this.#data.has(slotId) && !this.#data.get(slotId).has(participantId)) {
      this.#data.get(slotId).add(participantId);
      this.#emit();
    }
  }

  subscribeParticipantToAllSlots(participantId) {
    this.#data.forEach((value) => {
      if (!value.has(participantId)) {
        value.add(participantId);
      }
    });
    this.#emit();
  }

  subscribeAllParticipantsToSlot(slotId) {
    if (this.#data.has(slotId)) {
      this.#data.set(slotId, this.#participants);
    }
    this.#emit();
  }

  /** Unsubscribes a participant from a slot.
   * @param {string} slotId
   * @param {string} participantId
   */
  unsubscribe(slotId, participantId) {
    if (this.hasParticipant(slotId, participantId)) {
      this.#data.get(slotId).delete(participantId);
      this.#emit();
    }
  }

  /** Checks if a participant is registered to a slot.
   * @param {string} slotId
   * @param {string} participantId
   * @returns
   */
  hasParticipant(slotId, participantId) {
    return !!(
      this.#data.has(slotId) && this.#data.get(slotId).has(participantId)
    );
  }

  /**
   * Gets all the participants of a slot.
   * @param {string}  slotId
   * @returns {Set<string>}
   */
  getParticipantsBySlot(slotId) {
    return this.#data.get(slotId) || new Set();
  }

  /**
   * Gets all the slots of a participants.
   * @param {string} participantId
   * @returns {Set<string>}
   */
  getSlotsByParticipant(participantId) {
    return this.getParticipantsMap().get(participantId) || new Set();
  }

  /**
   * Gets a map of slots with their participants.
   * @returns {Map<string, Set<string>>}
   */
  getSlotsMap() {
    return this.#data;
  }

  /**
   * Gets a map of participants with their slots.
   * @returns {Map<string, Set<string>>}
   */
  getParticipantsMap() {
    const data = new Map();
    Array.from(this.#data.entries()).forEach(function (slotEntry) {
      const slotId = slotEntry[0];
      const participants = slotEntry[1];
      participants.forEach(function (participantId) {
        if (!data.has(participantId)) {
          data.set(participantId, new Set([slotId]));
        } else {
          data.get(participantId).add(slotId);
        }
      });
    });
    return data;
  }

  /**
   * Event emitter of changes in data.
   */
  async #emit() {
    const participants = this.getParticipantsMap();
    this.#listeners.forEach((listener) => {
      listener();
    });
  }

  /**
   * Event Listener of changes in data.
   * @param {() => void} cb
   */
  onChange(cb) {
    if (typeof cb === "function") {
      this.#listeners.push(cb);
    }
  }
}
