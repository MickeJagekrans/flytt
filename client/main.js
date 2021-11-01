((document, window) => {

  const labelBasePath = "C:/Users/micke/Code/flytt/client/labels";

  let boxNumberInput;
  let roomInput;
  let roomsDataList;
  let rooms;

  const autoselectFirstInDatalist = (event) => {
    if (event.key !== 'Enter') return;

    const roomInputValue = event.target.value;

    // Room has been selected and enter has been pressed, submit form
    if (rooms.filter(r => r == roomInputValue).length === 1) {
      console.log('room selected, submit');

      return;
    }

    event.cancelBubble = true;
    event.preventDefault();

    const firstInList = 
      rooms.filter(
        r => r.toLowerCase().startsWith(roomInputValue.toLowerCase())
      )[0];

    // If nothing in the list matches, this is an invalid room.
    if (!firstInList) return;

    // If an option exists, set it as the value of the input
    // Refocus on the input to enable submitting the form via enter
    roomInput.value = firstInList;
    roomInput.blur();
    roomInput.focus();
  };

  window.addEventListener('DOMContentLoaded', () => {
    boxNumberInput = document.querySelector('#box-number');
    roomInput = document.querySelector('#room');
    roomsDataList = document.querySelector('#rooms');
    rooms = Array.from(roomsDataList.options).map(x => x.value);

    roomInput.addEventListener('keydown', autoselectFirstInDatalist);
  });

  const setObjectText = (object, value) => {
    const objectName = object.getObjectNames()[0];

    object.setObjectText(objectName, value);

    console.log('set object text: ' + object.getObjectText(objectName));
  };

  const isValidRoom = (rooms, room) =>
    rooms.filter(r => r === room).length === 1;

  const _print = (dymo, label, text, copies = 2) => {
    setObjectText(label, text);

    const printParamsXml = dymo.label.framework.createLabelWriterPrintParamsXml({ copies });

    console.log('printing', text);

    label.print("DYMO LabelWriter 450", printParamsXml);
  };

  const printFn = async (dymo, boxNumber, room) => {
    if (!room || !boxNumber) return;
    if (!isValidRoom(rooms, room)) return;

    const boxNumberLabel = dymo.label.framework.openLabelFile(`${labelBasePath}/box-number.dymo`);
    const roomLabel = dymo.label.framework.openLabelFile(`${labelBasePath}/room.dymo`);

    _print(dymo, boxNumberLabel, boxNumber);
    _print(dymo, roomLabel, room);
  };

  window.print = async (e, dymo) => {
    e.preventDefault();

    await printFn(dymo, boxNumberInput.value, roomInput.value);
  };

})(document, window);