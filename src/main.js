import * as $ from "jquery";

// Setups the data
//---------------------------------------------------------------------

const slotsData = new Map([
  ["s0", new Set(["c1", "c2", "c4"])],
  ["s1", new Set(["c0", "c1", "c3"])],
  ["s2", new Set(["c3", "c4"])],
  ["s3", new Set(["c0", "c1", "c2", "c3"])],
  ["s4", new Set(["c2", "c3", "c4"])],
]);

const participantsData = (function (slotsData) {
  // Generates the map of the participants from that of the slots
  const data = new Map();
  Array.from(slotsData.entries()).forEach(function (slotEntry) {
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
})(slotsData);

// Running...
//---------------------------------------------------------------------

$(function () {
  // Propagates data to view
  //-----------------------

  $(".participant").each(function () {
    // Fills the number of slots reserved by each participant
    const $participant = $(this);
    const participantId = $participant.attr("data-participant-id");
    const numberOfslots = participantsData.get(participantId);
    const counter = numberOfslots ? numberOfslots.size : 0;
    $participant.find(".participant-slots_count").text(counter);
  });
  $(".slot").each(function () {
    // Fills the number of slots reserved by each participant
    const $slot = $(this);
    const slotId = $slot.attr("data-slot-id");
    const numberOfslots = slotsData.get(slotId);
    const counter = numberOfslots ? numberOfslots.size : 0;
    $slot.find(".slot-participants_count").text(counter);
  });

  // Handles communication between tables
  //-------------------------------------------------------------------
  const displaySlotsOfParticipant = function (participant$) {
    const participantId = participant$.attr("data-participant-id");

    // Switch the slot view:
    $(".slot").each(function () {
      const $slot = $(this);
      const $slotAction = $slot.find(".slot-participants--actions");
      const $slotCounter = $slot.find(".slot-participants--counter");
      const slotId = $slot.attr("data-slot-id");
      const isOccupiedByParticipant = slotsData.get(slotId).has(participantId);

      // Enables/Disables the checkbox
      if (isOccupiedByParticipant) {
        $slotAction.find("input").attr("checked", "checked");
      } else {
        $slotAction.find("input").removeAttr("checked");
      }

      // Toggle the slot view
      $slotCounter.hide();
      $slotAction.show();
    });
  };

  const displayParticipantsOfSlot = function (slot$) {
    const slotId = slot$.attr("data-slot-id");

    // Switch the slot view:
    $(".participant").each(function () {
      const $participant = $(this);

      const $participantAction = $participant.find(
        ".participant-slots--actions"
      );
      const $participantCounter = $participant.find(
        ".participant-slots--counter"
      );
      const participantId = $participant.attr("data-participant-id");
      const isParticipantOfSlot = participantsData
        .get(participantId)
        .has(slotId);

      // Enables/Disables the checkbox
      if (isParticipantOfSlot) {
        $participantAction.find("input").attr("checked", "checked");
      } else {
        $participantAction.find("input").removeAttr("checked");
      }

      // Toggle the slot view
      $participantCounter.hide();
      $participantAction.show();
    });
  };

  // Listeners

  // Toggles the slots table with data of a single participant on hover
  $(".participants-list")
    .on("mouseenter", ".participant", function () {
      const $participant = $(this);
      displaySlotsOfParticipant($participant);
    })
    .on("mouseleave", ".participant", function () {
      $(".slot-participants--actions").hide();
      $(".slot-participants--counter").show();
    });

  // Toggles the participants table with data of a single slot on hover
  $(".slots-list")
    .on("mouseenter", ".slot", function () {
      const $slot = $(this);
      displayParticipantsOfSlot($slot);
    })
    .on("mouseleave", ".slot", function () {
      $(".participant-slots--actions").hide();
      $(".participant-slots--counter").show();
    });
});
