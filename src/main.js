import * as $ from "jquery";
import { ShapeDivider } from "./lib/shape-divider";
import { SlotsManager } from "./lib/slots-manager";

// Setups the data
//---------------------------------------------------------------------

const LOCK_PARTICIPANTS = "participants";
const LOCK_SLOTS = "slots";
const UNLOCKED = "";

const slotsData = new Map([
  ["s0", new Set(["c1", "c2", "c4"])],
  ["s1", new Set(["c0", "c1", "c3"])],
  ["s2", new Set(["c3", "c4"])],
  ["s3", new Set(["c0", "c1", "c2", "c3"])],
  ["s4", new Set(["c2", "c3", "c4"])],
  ["s5", new Set(["c2", "c1", "c4"])],
  ["s6", new Set(["c0", "c3", "c2"])],
  ["s7", new Set(["c2", "c0", "c1"])],
]);
const slotsManager = new SlotsManager(slotsData);
let lockedState = UNLOCKED;
let currentSlotId = "";
let currentParticipantId = "";

const isLocked = () => {
  return lockedState !== UNLOCKED;
};

const participantsLocked = () => {
  return lockedState === LOCK_PARTICIPANTS;
};

const slotsLocked = () => {
  return lockedState === LOCK_SLOTS;
};

const lockList = (value) => {
  lockedState = value;
};

const unlock = () => {
  lockedState = UNLOCKED;
};

// Running...
//---------------------------------------------------------------------

$(function () {
  const $participantsList = $(".participants-list");
  const $slotsList = $(".slots-list");

  // Propagates data to view
  //-----------------------

  const refreshView = function () {
    $(".participant").each(function () {
      // Fills the number of slots reserved by each participant
      const $participant = $(this);
      const participantId = $participant.attr("data-item-id");
      const numberOfslots =
        slotsManager.getSlotsByParticipant(participantId).size;
      const counter = numberOfslots || 0;
      $participant.find(".item_count").text(counter);
    });
    $(".slot").each(function () {
      // Fills the number of slots reserved by each participant
      const $slot = $(this);
      const slotId = $slot.attr("data-item-id");
      const numberOfslots = slotsManager.getParticipantsBySlot(slotId).size;
      const counter = numberOfslots || 0;
      $slot.find(".item_count").text(counter);
    });
  };
  refreshView();
  slotsManager.onChange(function () {
    refreshView();
  });

  // Prepares the shape
  //-------------------
  const shapeDividerElement = document.getElementById("shape-divider");
  const shapeDivider = new ShapeDivider(shapeDividerElement);

  /**
   * Redraws the svg between tables in updating the points position.
   * @param {Jquery<HTMLElement>} $toItem
   */
  const displayDividerShape = function ($toItem) {
    if ($.contains($slotsList[0], $toItem[0])) {
      const bY = $toItem.position().top;
      const cY = bY + $toItem.height();
      shapeDivider.setDynamicPositions(bY, cY, $participantsList.height());
      shapeDivider.draw();
      shapeDivider.flipToLeft();
    } else {
      const bY = $toItem.position().top;
      const cY = bY + $toItem.height();
      shapeDivider.setDynamicPositions(bY, cY, $slotsList.height());
      shapeDivider.draw();
      shapeDivider.flipToRight();
    }
  };

  // Handles communication between tables
  //--------------------------------------

  const displaySlotsOfParticipant = function (participantId) {
    // It switches the slot view:
    $(".slot").each(function () {
      const $slot = $(this);
      const $slotAction = $slot.find(".item-actions");
      const $slotCounter = $slot.find(".item-counter");
      const slotId = $slot.attr("data-item-id");
      const isOccupiedByParticipant = slotsManager.hasParticipant(
        slotId,
        participantId
      );

      // Enables/Disables the checkbox
      $slotAction.find("input")[0].checked = isOccupiedByParticipant;

      // Toggles the slot view
      $slotCounter.hide();
      $slotAction.show();
    });
  };

  const displayParticipantsOfSlot = function (slotId) {
    // It switches the participants view:
    $(".participant").each(function () {
      const $participant = $(this);

      const $participantAction = $participant.find(".item-actions");
      const $participantCounter = $participant.find(".item-counter");
      const participantId = $participant.attr("data-item-id");
      const isParticipantOfSlot = slotsManager.hasParticipant(
        slotId,
        participantId
      );

      // Enables/Disables the checkbox
      $participantAction.find("input")[0].checked = isParticipantOfSlot;

      // Toggles the slot view
      $participantCounter.hide();
      $participantAction.show();
    });
  };

  // Listeners

  // Toggles the slots table with data of a single participant on hover
  $participantsList
    .on("mouseenter", ".participant", function (event) {
      if (slotsLocked()) {
        return;
      }

      // Displays the slots of the participant.
      const $participant = $(this);
      currentParticipantId = $participant.attr("data-item-id");
      $participantsList.find(".hovered").removeClass("hovered");
      $participant.addClass("hovered");
      displaySlotsOfParticipant(currentParticipantId);

      // Draws the svg divider.
      $(shapeDividerElement).show();
      displayDividerShape($participant);
    })
    .on("mouseleave", ".participant", function () {
      const $participant = $(this);
      if (isLocked()) return;
      // Resets the view.
      $participant.removeClass("hovered");
      currentParticipantId = "";
      $(".item-actions").hide();
      $(".item-counter").show();
      $(shapeDividerElement).hide();
    });

  // Toggles the participants table with data of a single slot on hover
  $slotsList
    .on("mouseenter", ".slot", function (event) {
      if (participantsLocked()) {
        return;
      }

      // Displays the participants of the slot:
      const $slot = $(this);
      currentSlotId = $slot.attr("data-item-id");

      $slotsList.find(".hovered").removeClass("hovered");
      $slot.addClass("hovered");
      displayParticipantsOfSlot(currentSlotId);

      // Draws the svg divider:
      $(shapeDividerElement).show();
      displayDividerShape($slot);
    })
    .on("mouseleave", ".slot", function () {
      const $slot = $(this);
      if (isLocked()) return;
      // Resets the view.
      $slot.removeClass("hovered");
      currentSlotId = "";
      $(".item-actions").hide();
      $(".item-counter").show();
      $(shapeDividerElement).hide();
    });

  // Edits the slots and participants
  $participantsList.on("click", function (event) {
    if (!isLocked()) {
      lockList(LOCK_PARTICIPANTS);
    }
  });
  $participantsList.on("change", "input[type=checkbox]", function (event) {
    const isChecked = event.target.checked;
    const value = $(this).val();
    if (isChecked) {
      slotsManager.subscribe(currentSlotId, value);
    } else {
      slotsManager.unsubscribe(currentSlotId, value);
    }
    event.preventDefault();
    event.stopImmediatePropagation();
  });

  $slotsList.on("click", function (event) {
    if (!isLocked()) {
      lockList(LOCK_SLOTS);
    }
  });

  $slotsList.on("change", "input[type=checkbox]", function (event) {
    const isChecked = event.target.checked;
    const value = $(this).val();
    if (isChecked) {
      slotsManager.subscribe(value, currentParticipantId);
    } else {
      slotsManager.unsubscribe(value, currentParticipantId);
    }
    event.preventDefault();
    event.stopImmediatePropagation();
  });

  $(".reset-area, .divider").on("click", function (event) {
    currentSlotId = "";
    currentParticipantId = "";
    $(".item-actions").hide();
    $(".item-counter").show();
    $(".hovered").removeClass("hovered");
    $(shapeDividerElement).hide();
    unlock();
  });
});
