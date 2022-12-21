import React, { Component } from "react";
import { getToken } from "./tokens";

export class Randomizer extends Component {
  constructor() {
    super();
    this.state = {
      API_KEY: process.env.REACT_APP_API_KEY,
      CLIENT_ID: process.env.REACT_APP_CLIENT_ID,
      CLIENT_SECRET: process.env.REACT_APP_CLIENT_SECRET,
      memershipId: localStorage.getItem("membershipId"),
      membershipType: "",
      displayName: "",
      characters: [],
      selectedClass: "",
      titanInventory: [],
      titanEquipped: [],
      hunterInventory: [],
      hunterEquipped: [],
      warlockInventory: [],
      warlockEquipped: [],
      vault: [],
      kinetic: [],
      energy: [],
      power: [],
      helmet: [],
      gauntlets: [],
      chestArmor: [],
      legArmor: [],
      classArmor: [],
      buttonEnabled: true,
      buttonState: "Randomize",
    };
    this.randomize = this.randomize.bind(this);
    this.handleClassChange = this.handleClassChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  async componentDidMount() {
    getToken(localStorage.getItem("accessToken"));
    const request = await fetch(
      `https://www.bungie.net/Platform/Destiny2/254/Profile/${localStorage.getItem(
        "membershipId"
      )}/LinkedProfiles/`,
      {
        method: "GET",
        headers: {
          "X-API-Key": `${this.state.API_KEY}`,
        },
      }
    );
    const response = await request.json();
    this.setState(
      {
        membershipId: response["Response"]["profiles"][0]["membershipId"],
        membershipType: response["Response"]["profiles"]["0"]["membershipType"],
        displayName: response["Response"]["profiles"][0]["displayName"],
      },
      this.getCharacters
    );
  }
  async getCharacters() {
    getToken(localStorage.getItem("accessToken"));
    const request = await fetch(
      `https://www.bungie.net/Platform/Destiny2/${this.state.membershipType}/Profile/${this.state.membershipId}/?components=200`,
      {
        method: "GET",
        headers: {
          "X-API-Key": `${this.state.API_KEY}`,
        },
      }
    );
    const response = await request.json();
    const charIds = Object.keys(response["Response"]["characters"]["data"]).map(
      (x) => x
    );
    this.setState({ characters: charIds });
  }
  handleClassChange(e) {
    if (e.target.value == "titan") {
      this.setState({ selectedClass: this.state.characters[0] });
    } else if (e.target.value == "hunter") {
      this.setState({ selectedClass: this.state.characters[1] });
    } else {
      this.setState({ selectedClass: this.state.characters[2] });
    }
  }
  handleClick() {
    if (this.state.buttonEnabled) {
      this.setState({ buttonEnabled: false, buttonState: "Please Wait" });
      this.randomize();
      setTimeout(() => {
        this.setState({ buttonEnabled: true, buttonState: "Randomize" });
      }, 60000);
    } else {
      alert("Please wait for the API to sync");
    }
  }
  setItem(slot, exoticTaken) {
    let item = slot[Math.floor(Math.random() * slot.length)];
    while (item.dismantlePermission == 1 && exoticTaken) {
      item = slot[Math.floor(Math.random() * slot.length)];
    }
    return item;
  }
  equipItem(id, character) {
    fetch("https://www.bungie.net/Platform/Destiny2/Actions/Items/EquipItem/", {
      method: "POST",
      headers: {
        "X-API-Key": `${this.state.API_KEY}`,
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        itemId: id,
        characterId: character,
        membershipType: this.state.membershipType,
      }),
    });
    return new Promise((res) => {
      setTimeout(() => {
        res();
      }, 1000);
    });
  }
  async randomize() {
    getToken(localStorage.getItem("accessToken"));
    const request = await fetch(
      `https://www.bungie.net/Platform/Destiny2/${this.state.membershipType}/Profile/${this.state.membershipId}/?components=102,201,205`,
      {
        method: "GET",
        headers: {
          "X-API-Key": `${this.state.API_KEY}`,
        },
      }
    );
    const response = await request.json();
    const titanInventory = response["Response"]["characterInventories"]["data"][
      this.state.characters[0]
    ]["items"].filter(
      (item) =>
        item.itemInstanceId &&
        item.transferStatus == 0 &&
        item.bucketHash != 215593132
    );
    const titanEquipped =
      response["Response"]["characterEquipment"]["data"][
        this.state.characters[0]
      ]["items"];
    const hunterInventory = response["Response"]["characterInventories"][
      "data"
    ][this.state.characters[1]]["items"].filter(
      (item) =>
        item.itemInstanceId &&
        item.transferStatus == 0 &&
        item.bucketHash != 215593132
    );
    const hunterEquipped =
      response["Response"]["characterEquipment"]["data"][
        this.state.characters[1]
      ]["items"];
    const warlockInventory = response["Response"]["characterInventories"][
      "data"
    ][this.state.characters[2]]["items"].filter(
      (item) =>
        item.itemInstanceId &&
        item.transferStatus == 0 &&
        item.bucketHash != 215593132
    );
    const warlockEquipped =
      response["Response"]["characterEquipment"]["data"][
        this.state.characters[2]
      ]["items"];
    this.setState(
      {
        titanInventory: titanInventory,
        titanEquipped: titanEquipped,
        hunterInventory: hunterInventory,
        hunterEquipped: hunterEquipped,
        warlockInventory: warlockInventory,
        warlockEquipped: warlockEquipped,
      },
      () => {
        if (this.state.selectedClass == this.state.characters[0]) {
          this.setState(
            {
              kinetic: titanInventory.filter(
                (item) => item.bucketHash == 1498876634
              ),
              energy: titanInventory.filter(
                (item) => item.bucketHash == 2465295065
              ),
              power: titanInventory.filter(
                (item) => item.bucketHash == 953998645
              ),
              helmet: titanInventory.filter(
                (item) => item.bucketHash == 3448274439
              ),
              gauntlets: titanInventory.filter(
                (item) => item.bucketHash == 3551918588
              ),
              chestArmor: titanInventory.filter(
                (item) => item.bucketHash == 14239492
              ),
              legArmor: titanInventory.filter(
                (item) => item.bucketHash == 20886954
              ),
              classArmor: titanInventory.filter(
                (item) => item.bucketHash == 1585787867
              ),
            },
            async () => {
              let kinetic;
              let energy;
              let power;
              let helmet;
              let gauntlets;
              let chestArmor;
              let legArmor;
              let classArmor;
              const firstWeaponSlot = Math.floor(Math.random() * 3);
              let exoticWeapon = false;
              if (firstWeaponSlot == 0) {
                kinetic = this.setItem(this.state.kinetic, exoticWeapon);
                if (kinetic.dismantlePermission == 1) {
                  exoticWeapon = true;
                }
                const secondWeaponSlot = Math.floor(Math.random() * 2);
                if (secondWeaponSlot == 0) {
                  energy = this.setItem(this.state.energy, exoticWeapon);
                  if (energy.dismantlePermission == 1) {
                    exoticWeapon = true;
                  }
                  power = this.setItem(this.state.power, exoticWeapon);
                } else {
                  power = this.setItem(this.state.power, exoticWeapon);
                  if (power.dismantlePermission == 1) {
                    exoticWeapon = true;
                  }
                  energy = this.setItem(this.state.energy, exoticWeapon);
                }
              } else if (firstWeaponSlot == 1) {
                energy = this.setItem(this.state.energy, exoticWeapon);
                if (energy.dismantlePermission == 1) {
                  exoticWeapon = true;
                }
                const secondWeaponSlot = Math.floor(Math.random() * 2);
                if (secondWeaponSlot == 0) {
                  kinetic = this.setItem(this.state.kinetic, exoticWeapon);
                  if (kinetic.dismantlePermission == 1) {
                    exoticWeapon = true;
                  }
                  power = this.setItem(this.state.power, exoticWeapon);
                } else {
                  power = this.setItem(this.state.power, exoticWeapon);
                  if (power.dismantlePermission == 1) {
                    exoticWeapon = true;
                  }
                  kinetic = this.setItem(this.state.kinetic, exoticWeapon);
                }
              } else {
                power = this.setItem(this.state.power, exoticWeapon);
                if (power.dismantlePermission == 1) {
                  exoticWeapon = true;
                }
                const secondWeaponSlot = Math.floor(Math.random() * 2);
                if (secondWeaponSlot == 0) {
                  kinetic = this.setItem(this.state.kinetic, exoticWeapon);
                  if (kinetic.dismantlePermission == 1) {
                    exoticWeapon = true;
                  }
                  energy = this.setItem(this.state.energy, exoticWeapon);
                } else {
                  energy = this.setItem(this.state.energy, exoticWeapon);
                  if (energy.dismantlePermission == 1) {
                    exoticWeapon = true;
                  }
                  kinetic = this.setItem(this.state.kinetic, exoticWeapon);
                }
              }
              const firstArmorSlot = Math.floor(Math.random() * 5);
              let exoticArmor = false;
              if (firstArmorSlot == 0) {
                helmet = this.setItem(this.state.helmet, exoticArmor);
                if (helmet.dismantlePermission == 1) {
                  exoticArmor = true;
                }
                const secondArmorSlot = Math.floor(Math.random() * 4);
                if (secondArmorSlot == 0) {
                  gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                  if (gauntlets.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    chestArmor = this.setItem(
                      this.state.chestArmor,
                      exoticArmor
                    );
                    if (chestArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    if (legArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(this.state.classArmor);
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                    }
                  } else {
                    classArmor = this.setItem(
                      this.state.classArmor,
                      exoticArmor
                    );
                    if (classArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    } else {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    }
                  }
                } else if (secondArmorSlot == 1) {
                  chestArmor = this.setItem(this.state.chestArmor, exoticArmor);
                  if (chestArmor.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                    if (gauntlets.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    if (legArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(this.state.classArmor);
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    }
                  } else {
                    classArmor = this.setItem(
                      this.state.classArmor,
                      exoticArmor
                    );
                    if (classArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    } else {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    }
                  }
                } else if (secondArmorSlot == 2) {
                  legArmor = this.setItem(this.state.legArmor, exoticArmor);
                  if (legArmor.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    chestArmor = this.setItem(
                      this.state.chestArmor,
                      exoticArmor
                    );
                    if (chestArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    }
                  } else if (thirdArmorSlot == 1) {
                    gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                    if (gauntlets.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(this.state.classArmor);
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                    }
                  } else {
                    classArmor = this.setItem(
                      this.state.classArmor,
                      exoticArmor
                    );
                    if (classArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    } else {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    }
                  }
                } else {
                  classArmor = this.setItem(this.state.classArmor, exoticArmor);
                  if (classArmor.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    chestArmor = this.setItem(
                      this.state.chestArmor,
                      exoticArmor
                    );
                    if (chestArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    } else {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    if (legArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    } else {
                      gauntlets = this.setItem(this.state.gauntlets);
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                    }
                  } else {
                    gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                    if (gauntlets.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    } else {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    }
                  }
                }
              } else if (firstArmorSlot == 1) {
                gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                if (gauntlets.dismantlePermission == 1) {
                  exoticArmor = true;
                }
                const secondArmorSlot = Math.floor(Math.random() * 4);
                if (secondArmorSlot == 0) {
                  helmet = this.setItem(this.state.helmet, exoticArmor);
                  if (helmet.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    chestArmor = this.setItem(
                      this.state.chestArmor,
                      exoticArmor
                    );
                    if (chestArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    if (legArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(this.state.classArmor);
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                    }
                  } else {
                    classArmor = this.setItem(
                      this.state.classArmor,
                      exoticArmor
                    );
                    if (classArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    } else {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    }
                  }
                } else if (secondArmorSlot == 1) {
                  chestArmor = this.setItem(this.state.chestArmor, exoticArmor);
                  if (chestArmor.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    helmet = this.setItem(this.state.helmet, exoticArmor);
                    if (helmet.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    if (legArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(this.state.classArmor);
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    }
                  } else {
                    classArmor = this.setItem(
                      this.state.classArmor,
                      exoticArmor
                    );
                    if (classArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    } else {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    }
                  }
                } else if (secondArmorSlot == 2) {
                  legArmor = this.setItem(this.state.legArmor, exoticArmor);
                  if (legArmor.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    chestArmor = this.setItem(
                      this.state.chestArmor,
                      exoticArmor
                    );
                    if (chestArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    helmet = this.setItem(this.state.helmet, exoticArmor);
                    if (helmet.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(this.state.classArmor);
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                    }
                  } else {
                    classArmor = this.setItem(
                      this.state.classArmor,
                      exoticArmor
                    );
                    if (classArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    } else {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    }
                  }
                } else if (secondArmorSlot == 3) {
                  classArmor = this.setItem(this.state.classArmor, exoticArmor);
                  if (classArmor.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    chestArmor = this.setItem(
                      this.state.chestArmor,
                      exoticArmor
                    );
                    if (chestArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    } else {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    if (legArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    } else {
                      helmet = this.setItem(this.state.helmet);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                    }
                  } else {
                    helmet = this.setItem(this.state.helmet, exoticArmor);
                    if (helmet.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    } else {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(this.state.helmet, exoticArmor);
                    }
                  }
                }
              } else if (firstArmorSlot == 2) {
                chestArmor = this.setItem(this.state.chestArmor, exoticArmor);
                if (chestArmor.dismantlePermission == 1) {
                  exoticArmor = true;
                }
                const secondArmorSlot = Math.floor(Math.random() * 4);
                if (secondArmorSlot == 0) {
                  gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                  if (gauntlets.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    helmet = this.setItem(this.state.helmet, exoticArmor);
                    if (helmet.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    if (legArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(this.state.classArmor);
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    }
                  } else {
                    classArmor = this.setItem(
                      this.state.classArmor,
                      exoticArmor
                    );
                    if (classArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    } else {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.classArmor, exoticArmor);
                    }
                  }
                } else if (secondArmorSlot == 1) {
                  helmet = this.setItem(this.state.helmet, exoticArmor);
                  if (helmet.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                    if (gauntlets.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    if (legArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(this.state.classArmor);
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    }
                  } else {
                    classArmor = this.setItem(
                      this.state.classArmor,
                      exoticArmor
                    );
                    if (classArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    } else {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    }
                  }
                } else if (secondArmorSlot == 2) {
                  legArmor = this.setItem(this.state.legArmor, exoticArmor);
                  if (legArmor.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    helmet = this.setItem(this.state.helmet, exoticArmor);
                    if (helmet.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    }
                  } else if (thirdArmorSlot == 1) {
                    gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                    if (gauntlets.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(this.state.classArmor);
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    }
                  } else {
                    classArmor = this.setItem(
                      this.state.classArmor,
                      exoticArmor
                    );
                    if (classArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    } else {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.classArmor, exoticArmor);
                    }
                  }
                } else if (secondArmorSlot == 3) {
                  classArmor = this.setItem(this.state.classArmor, exoticArmor);
                  if (classArmor.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    helmet = this.setItem(this.state.helmet, exoticArmor);
                    if (helmet.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    } else {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    if (legArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    } else {
                      gauntlets = this.setItem(this.state.gauntlets);
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    }
                  } else {
                    gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                    if (gauntlets.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    } else {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.gauntlets, exoticArmor);
                    }
                  }
                }
              } else if (firstArmorSlot == 3) {
                legArmor = this.setItem(this.state.legArmor, exoticArmor);
                if (legArmor.dismantlePermission == 1) {
                  exoticArmor = true;
                }
                const secondArmorSlot = Math.floor(Math.random() * 4);
                if (secondArmorSlot == 0) {
                  gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                  if (gauntlets.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    chestArmor = this.setItem(
                      this.state.chestArmor,
                      exoticArmor
                    );
                    if (chestArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    helmet = this.setItem(this.state.helmet, exoticArmor);
                    if (helmet.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(this.state.classArmor);
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                    }
                  } else {
                    classArmor = this.setItem(
                      this.state.classArmor,
                      exoticArmor
                    );
                    if (classArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    } else {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    }
                  }
                } else if (secondArmorSlot == 1) {
                  chestArmor = this.setItem(this.state.chestArmor, exoticArmor);
                  if (chestArmor.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                    if (gauntlets.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    helmet = this.setItem(this.state.helmet, exoticArmor);
                    if (helmet.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(this.state.classArmor);
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    }
                  } else {
                    classArmor = this.setItem(
                      this.state.classArmor,
                      exoticArmor
                    );
                    if (classArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    } else {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    }
                  }
                } else if (secondArmorSlot == 2) {
                  helmet = this.setItem(this.state.helmet, exoticArmor);
                  if (helmet.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    chestArmor = this.setItem(
                      this.state.chestArmor,
                      exoticArmor
                    );
                    if (chestArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    }
                  } else if (thirdArmorSlot == 1) {
                    gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                    if (gauntlets.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(this.state.classArmor);
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                    }
                  } else {
                    classArmor = this.setItem(
                      this.state.classArmor,
                      exoticArmor
                    );
                    if (classArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    } else {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    }
                  }
                } else if (secondArmorSlot == 3) {
                  classArmor = this.setItem(this.state.classArmor, exoticArmor);
                  if (classArmor.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    chestArmor = this.setItem(
                      this.state.chestArmor,
                      exoticArmor
                    );
                    if (chestArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    } else {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    helmet = this.setItem(this.state.helmet, exoticArmor);
                    if (helmet.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    } else {
                      gauntlets = this.setItem(this.state.gauntlets);
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                    }
                  } else {
                    gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                    if (gauntlets.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    } else {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    }
                  }
                }
              } else {
                classArmor = this.setItem(this.state.classArmor, exoticArmor);
                if (classArmor.dismantlePermission == 1) {
                  exoticArmor = true;
                }
                const secondArmorSlot = Math.floor(Math.random() * 4);
                if (secondArmorSlot == 0) {
                  gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                  if (gauntlets.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    chestArmor = this.setItem(
                      this.state.chestArmor,
                      exoticArmor
                    );
                    if (chestArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    } else {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    if (legArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    } else {
                      helmet = this.setItem(this.state.helmet);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                    }
                  } else {
                    helmet = this.setItem(this.state.helmet, exoticArmor);
                    if (helmet.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    } else {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(this.state.helmet, exoticArmor);
                    }
                  }
                } else if (secondArmorSlot == 1) {
                  chestArmor = this.setItem(this.state.chestArmor, exoticArmor);
                  if (chestArmor.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                    if (gauntlets.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    } else {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    if (legArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    } else {
                      helmet = this.setItem(this.state.helmet);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    }
                  } else {
                    helmet = this.setItem(this.state.helmet, exoticArmor);
                    if (helmet.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    } else {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    }
                  }
                } else if (secondArmorSlot == 2) {
                  legArmor = this.setItem(this.state.legArmor, exoticArmor);
                  if (legArmor.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    chestArmor = this.setItem(
                      this.state.chestArmor,
                      exoticArmor
                    );
                    if (chestArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    } else {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    }
                  } else if (thirdArmorSlot == 1) {
                    gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                    if (gauntlets.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    } else {
                      helmet = this.setItem(this.state.helmet);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                    }
                  } else {
                    helmet = this.setItem(this.state.helmet, exoticArmor);
                    if (helmet.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    } else {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(this.state.helmet, exoticArmor);
                    }
                  }
                } else if (secondArmorSlot == 3) {
                  helmet = this.setItem(this.state.helmet, exoticArmor);
                  if (helmet.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    chestArmor = this.setItem(
                      this.state.chestArmor,
                      exoticArmor
                    );
                    if (chestArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    } else {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    if (legArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    } else {
                      gauntlets = this.setItem(this.state.gauntlets);
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                    }
                  } else {
                    gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                    if (gauntlets.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    } else {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    }
                  }
                }
              }
              let weaponsEquipped = false;
              let armorEquipped = false;
              for (let i = 0; i < 8; i++) {
                if (titanEquipped[i].dismantlePermission == 1) {
                  switch (i) {
                    case 0:
                      await this.equipItem(
                        kinetic.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        energy.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        power.itemInstanceId,
                        this.state.selectedClass
                      );
                      weaponsEquipped = true;
                      break;
                    case 1:
                      await this.equipItem(
                        energy.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        kinetic.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        power.itemInstanceId,
                        this.state.selectedClass
                      );
                      weaponsEquipped = true;
                      break;
                    case 2:
                      await this.equipItem(
                        power.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        kinetic.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        energy.itemInstanceId,
                        this.state.selectedClass
                      );
                      weaponsEquipped = true;
                      break;
                    case 3:
                      await this.equipItem(
                        helmet.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        gauntlets.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        chestArmor.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        legArmor.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        classArmor.itemInstanceId,
                        this.state.selectedClass
                      );
                      armorEquipped = true;
                      break;
                    case 4:
                      await this.equipItem(
                        gauntlets.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        helmet.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        chestArmor.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        legArmor.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        classArmor.itemInstanceId,
                        this.state.selectedClass
                      );
                      armorEquipped = true;
                      break;
                    case 5:
                      await this.equipItem(
                        chestArmor.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        helmet.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        gauntlets.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        legArmor.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        classArmor.itemInstanceId,
                        this.state.selectedClass
                      );
                      armorEquipped = true;
                      break;
                    case 6:
                      await this.equipItem(
                        legArmor.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        helmet.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        gauntlets.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        chestArmor.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        classArmor.itemInstanceId,
                        this.state.selectedClass
                      );
                      armorEquipped = true;
                      break;
                    case 7:
                      await this.equipItem(
                        classArmor.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        helmet.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        gauntlets.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        chestArmor.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        legArmor.itemInstanceId,
                        this.state.selectedClass
                      );
                      armorEquipped = true;
                      break;
                  }
                }
              }
              if (!weaponsEquipped) {
                await this.equipItem(
                  kinetic.itemInstanceId,
                  this.state.selectedClass
                );
                await this.equipItem(
                  energy.itemInstanceId,
                  this.state.selectedClass
                );
                await this.equipItem(
                  power.itemInstanceId,
                  this.state.selectedClass
                );
                weaponsEquipped = true;
              }
              if (!armorEquipped) {
                await this.equipItem(
                  helmet.itemInstanceId,
                  this.state.selectedClass
                );
                await this.equipItem(
                  gauntlets.itemInstanceId,
                  this.state.selectedClass
                );
                await this.equipItem(
                  chestArmor.itemInstanceId,
                  this.state.selectedClass
                );
                await this.equipItem(
                  legArmor.itemInstanceId,
                  this.state.selectedClass
                );
                await this.equipItem(
                  classArmor.itemInstanceId,
                  this.state.selectedClass
                );
                armorEquipped = true;
              }
            }
          );
        }
        if (this.state.selectedClass == this.state.characters[1]) {
          this.setState(
            {
              kinetic: hunterInventory.filter(
                (item) => item.bucketHash == 1498876634
              ),
              energy: hunterInventory.filter(
                (item) => item.bucketHash == 2465295065
              ),
              power: hunterInventory.filter(
                (item) => item.bucketHash == 953998645
              ),
              helmet: hunterInventory.filter(
                (item) => item.bucketHash == 3448274439
              ),
              gauntlets: hunterInventory.filter(
                (item) => item.bucketHash == 3551918588
              ),
              chestArmor: hunterInventory.filter(
                (item) => item.bucketHash == 14239492
              ),
              legArmor: hunterInventory.filter(
                (item) => item.bucketHash == 20886954
              ),
              classArmor: hunterInventory.filter(
                (item) => item.bucketHash == 1585787867
              ),
            },
            async () => {
              let kinetic;
              let energy;
              let power;
              let helmet;
              let gauntlets;
              let chestArmor;
              let legArmor;
              let classArmor;
              const firstWeaponSlot = Math.floor(Math.random() * 3);
              let exoticWeapon = false;
              if (firstWeaponSlot == 0) {
                kinetic = this.setItem(this.state.kinetic, exoticWeapon);
                if (kinetic.dismantlePermission == 1) {
                  exoticWeapon = true;
                }
                const secondWeaponSlot = Math.floor(Math.random() * 2);
                if (secondWeaponSlot == 0) {
                  energy = this.setItem(this.state.energy, exoticWeapon);
                  if (energy.dismantlePermission == 1) {
                    exoticWeapon = true;
                  }
                  power = this.setItem(this.state.power, exoticWeapon);
                } else {
                  power = this.setItem(this.state.power, exoticWeapon);
                  if (power.dismantlePermission == 1) {
                    exoticWeapon = true;
                  }
                  energy = this.setItem(this.state.energy, exoticWeapon);
                }
              } else if (firstWeaponSlot == 1) {
                energy = this.setItem(this.state.energy, exoticWeapon);
                if (energy.dismantlePermission == 1) {
                  exoticWeapon = true;
                }
                const secondWeaponSlot = Math.floor(Math.random() * 2);
                if (secondWeaponSlot == 0) {
                  kinetic = this.setItem(this.state.kinetic, exoticWeapon);
                  if (kinetic.dismantlePermission == 1) {
                    exoticWeapon = true;
                  }
                  power = this.setItem(this.state.power, exoticWeapon);
                } else {
                  power = this.setItem(this.state.power, exoticWeapon);
                  if (power.dismantlePermission == 1) {
                    exoticWeapon = true;
                  }
                  kinetic = this.setItem(this.state.kinetic, exoticWeapon);
                }
              } else {
                power = this.setItem(this.state.power, exoticWeapon);
                if (power.dismantlePermission == 1) {
                  exoticWeapon = true;
                }
                const secondWeaponSlot = Math.floor(Math.random() * 2);
                if (secondWeaponSlot == 0) {
                  kinetic = this.setItem(this.state.kinetic, exoticWeapon);
                  if (kinetic.dismantlePermission == 1) {
                    exoticWeapon = true;
                  }
                  energy = this.setItem(this.state.energy, exoticWeapon);
                } else {
                  energy = this.setItem(this.state.energy, exoticWeapon);
                  if (energy.dismantlePermission == 1) {
                    exoticWeapon = true;
                  }
                  kinetic = this.setItem(this.state.kinetic, exoticWeapon);
                }
              }
              const firstArmorSlot = Math.floor(Math.random() * 5);
              let exoticArmor = false;
              if (firstArmorSlot == 0) {
                helmet = this.setItem(this.state.helmet, exoticArmor);
                if (helmet.dismantlePermission == 1) {
                  exoticArmor = true;
                }
                const secondArmorSlot = Math.floor(Math.random() * 4);
                if (secondArmorSlot == 0) {
                  gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                  if (gauntlets.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    chestArmor = this.setItem(
                      this.state.chestArmor,
                      exoticArmor
                    );
                    if (chestArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    if (legArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(this.state.classArmor);
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                    }
                  } else {
                    classArmor = this.setItem(
                      this.state.classArmor,
                      exoticArmor
                    );
                    if (classArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    } else {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    }
                  }
                } else if (secondArmorSlot == 1) {
                  chestArmor = this.setItem(this.state.chestArmor, exoticArmor);
                  if (chestArmor.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                    if (gauntlets.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    if (legArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(this.state.classArmor);
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    }
                  } else {
                    classArmor = this.setItem(
                      this.state.classArmor,
                      exoticArmor
                    );
                    if (classArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    } else {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    }
                  }
                } else if (secondArmorSlot == 2) {
                  legArmor = this.setItem(this.state.legArmor, exoticArmor);
                  if (legArmor.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    chestArmor = this.setItem(
                      this.state.chestArmor,
                      exoticArmor
                    );
                    if (chestArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    }
                  } else if (thirdArmorSlot == 1) {
                    gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                    if (gauntlets.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(this.state.classArmor);
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                    }
                  } else {
                    classArmor = this.setItem(
                      this.state.classArmor,
                      exoticArmor
                    );
                    if (classArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    } else {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    }
                  }
                } else {
                  classArmor = this.setItem(this.state.classArmor, exoticArmor);
                  if (classArmor.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    chestArmor = this.setItem(
                      this.state.chestArmor,
                      exoticArmor
                    );
                    if (chestArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    } else {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    if (legArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    } else {
                      gauntlets = this.setItem(this.state.gauntlets);
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                    }
                  } else {
                    gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                    if (gauntlets.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    } else {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    }
                  }
                }
              } else if (firstArmorSlot == 1) {
                gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                if (gauntlets.dismantlePermission == 1) {
                  exoticArmor = true;
                }
                const secondArmorSlot = Math.floor(Math.random() * 4);
                if (secondArmorSlot == 0) {
                  helmet = this.setItem(this.state.helmet, exoticArmor);
                  if (helmet.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    chestArmor = this.setItem(
                      this.state.chestArmor,
                      exoticArmor
                    );
                    if (chestArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    if (legArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(this.state.classArmor);
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                    }
                  } else {
                    classArmor = this.setItem(
                      this.state.classArmor,
                      exoticArmor
                    );
                    if (classArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    } else {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    }
                  }
                } else if (secondArmorSlot == 1) {
                  chestArmor = this.setItem(this.state.chestArmor, exoticArmor);
                  if (chestArmor.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    helmet = this.setItem(this.state.helmet, exoticArmor);
                    if (helmet.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    if (legArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(this.state.classArmor);
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    }
                  } else {
                    classArmor = this.setItem(
                      this.state.classArmor,
                      exoticArmor
                    );
                    if (classArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    } else {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    }
                  }
                } else if (secondArmorSlot == 2) {
                  legArmor = this.setItem(this.state.legArmor, exoticArmor);
                  if (legArmor.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    chestArmor = this.setItem(
                      this.state.chestArmor,
                      exoticArmor
                    );
                    if (chestArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    helmet = this.setItem(this.state.helmet, exoticArmor);
                    if (helmet.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(this.state.classArmor);
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                    }
                  } else {
                    classArmor = this.setItem(
                      this.state.classArmor,
                      exoticArmor
                    );
                    if (classArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    } else {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    }
                  }
                } else if (secondArmorSlot == 3) {
                  classArmor = this.setItem(this.state.classArmor, exoticArmor);
                  if (classArmor.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    chestArmor = this.setItem(
                      this.state.chestArmor,
                      exoticArmor
                    );
                    if (chestArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    } else {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    if (legArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    } else {
                      helmet = this.setItem(this.state.helmet);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                    }
                  } else {
                    helmet = this.setItem(this.state.helmet, exoticArmor);
                    if (helmet.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    } else {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(this.state.helmet, exoticArmor);
                    }
                  }
                }
              } else if (firstArmorSlot == 2) {
                chestArmor = this.setItem(this.state.chestArmor, exoticArmor);
                if (chestArmor.dismantlePermission == 1) {
                  exoticArmor = true;
                }
                const secondArmorSlot = Math.floor(Math.random() * 4);
                if (secondArmorSlot == 0) {
                  gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                  if (gauntlets.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    helmet = this.setItem(this.state.helmet, exoticArmor);
                    if (helmet.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    if (legArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(this.state.classArmor);
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    }
                  } else {
                    classArmor = this.setItem(
                      this.state.classArmor,
                      exoticArmor
                    );
                    if (classArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    } else {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.classArmor, exoticArmor);
                    }
                  }
                } else if (secondArmorSlot == 1) {
                  helmet = this.setItem(this.state.helmet, exoticArmor);
                  if (helmet.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                    if (gauntlets.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    if (legArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(this.state.classArmor);
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    }
                  } else {
                    classArmor = this.setItem(
                      this.state.classArmor,
                      exoticArmor
                    );
                    if (classArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    } else {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    }
                  }
                } else if (secondArmorSlot == 2) {
                  legArmor = this.setItem(this.state.legArmor, exoticArmor);
                  if (legArmor.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    helmet = this.setItem(this.state.helmet, exoticArmor);
                    if (helmet.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    }
                  } else if (thirdArmorSlot == 1) {
                    gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                    if (gauntlets.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(this.state.classArmor);
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    }
                  } else {
                    classArmor = this.setItem(
                      this.state.classArmor,
                      exoticArmor
                    );
                    if (classArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    } else {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.classArmor, exoticArmor);
                    }
                  }
                } else if (secondArmorSlot == 3) {
                  classArmor = this.setItem(this.state.classArmor, exoticArmor);
                  if (classArmor.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    helmet = this.setItem(this.state.helmet, exoticArmor);
                    if (helmet.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    } else {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    if (legArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    } else {
                      gauntlets = this.setItem(this.state.gauntlets);
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    }
                  } else {
                    gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                    if (gauntlets.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    } else {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.gauntlets, exoticArmor);
                    }
                  }
                }
              } else if (firstArmorSlot == 3) {
                legArmor = this.setItem(this.state.legArmor, exoticArmor);
                if (legArmor.dismantlePermission == 1) {
                  exoticArmor = true;
                }
                const secondArmorSlot = Math.floor(Math.random() * 4);
                if (secondArmorSlot == 0) {
                  gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                  if (gauntlets.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    chestArmor = this.setItem(
                      this.state.chestArmor,
                      exoticArmor
                    );
                    if (chestArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    helmet = this.setItem(this.state.helmet, exoticArmor);
                    if (helmet.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(this.state.classArmor);
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                    }
                  } else {
                    classArmor = this.setItem(
                      this.state.classArmor,
                      exoticArmor
                    );
                    if (classArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    } else {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    }
                  }
                } else if (secondArmorSlot == 1) {
                  chestArmor = this.setItem(this.state.chestArmor, exoticArmor);
                  if (chestArmor.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                    if (gauntlets.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    helmet = this.setItem(this.state.helmet, exoticArmor);
                    if (helmet.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(this.state.classArmor);
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    }
                  } else {
                    classArmor = this.setItem(
                      this.state.classArmor,
                      exoticArmor
                    );
                    if (classArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    } else {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    }
                  }
                } else if (secondArmorSlot == 2) {
                  helmet = this.setItem(this.state.helmet, exoticArmor);
                  if (helmet.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    chestArmor = this.setItem(
                      this.state.chestArmor,
                      exoticArmor
                    );
                    if (chestArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    }
                  } else if (thirdArmorSlot == 1) {
                    gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                    if (gauntlets.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(this.state.classArmor);
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                    }
                  } else {
                    classArmor = this.setItem(
                      this.state.classArmor,
                      exoticArmor
                    );
                    if (classArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    } else {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    }
                  }
                } else if (secondArmorSlot == 3) {
                  classArmor = this.setItem(this.state.classArmor, exoticArmor);
                  if (classArmor.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    chestArmor = this.setItem(
                      this.state.chestArmor,
                      exoticArmor
                    );
                    if (chestArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    } else {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    helmet = this.setItem(this.state.helmet, exoticArmor);
                    if (helmet.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    } else {
                      gauntlets = this.setItem(this.state.gauntlets);
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                    }
                  } else {
                    gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                    if (gauntlets.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    } else {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    }
                  }
                }
              } else {
                classArmor = this.setItem(this.state.classArmor, exoticArmor);
                if (classArmor.dismantlePermission == 1) {
                  exoticArmor = true;
                }
                const secondArmorSlot = Math.floor(Math.random() * 4);
                if (secondArmorSlot == 0) {
                  gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                  if (gauntlets.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    chestArmor = this.setItem(
                      this.state.chestArmor,
                      exoticArmor
                    );
                    if (chestArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    } else {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    if (legArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    } else {
                      helmet = this.setItem(this.state.helmet);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                    }
                  } else {
                    helmet = this.setItem(this.state.helmet, exoticArmor);
                    if (helmet.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    } else {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(this.state.helmet, exoticArmor);
                    }
                  }
                } else if (secondArmorSlot == 1) {
                  chestArmor = this.setItem(this.state.chestArmor, exoticArmor);
                  if (chestArmor.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                    if (gauntlets.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    } else {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    if (legArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    } else {
                      helmet = this.setItem(this.state.helmet);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    }
                  } else {
                    helmet = this.setItem(this.state.helmet, exoticArmor);
                    if (helmet.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    } else {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    }
                  }
                } else if (secondArmorSlot == 2) {
                  legArmor = this.setItem(this.state.legArmor, exoticArmor);
                  if (legArmor.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    chestArmor = this.setItem(
                      this.state.chestArmor,
                      exoticArmor
                    );
                    if (chestArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    } else {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    }
                  } else if (thirdArmorSlot == 1) {
                    gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                    if (gauntlets.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    } else {
                      helmet = this.setItem(this.state.helmet);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                    }
                  } else {
                    helmet = this.setItem(this.state.helmet, exoticArmor);
                    if (helmet.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    } else {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(this.state.helmet, exoticArmor);
                    }
                  }
                } else if (secondArmorSlot == 3) {
                  helmet = this.setItem(this.state.helmet, exoticArmor);
                  if (helmet.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    chestArmor = this.setItem(
                      this.state.chestArmor,
                      exoticArmor
                    );
                    if (chestArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    } else {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    if (legArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    } else {
                      gauntlets = this.setItem(this.state.gauntlets);
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                    }
                  } else {
                    gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                    if (gauntlets.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    } else {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    }
                  }
                }
              }
              let weaponsEquipped = false;
              let armorEquipped = false;
              for (let i = 0; i < 8; i++) {
                if (hunterEquipped[i].dismantlePermission == 1) {
                  switch (i) {
                    case 0:
                      await this.equipItem(
                        kinetic.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        energy.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        power.itemInstanceId,
                        this.state.selectedClass
                      );
                      weaponsEquipped = true;
                      break;
                    case 1:
                      await this.equipItem(
                        energy.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        kinetic.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        power.itemInstanceId,
                        this.state.selectedClass
                      );
                      weaponsEquipped = true;
                      break;
                    case 2:
                      await this.equipItem(
                        power.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        kinetic.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        energy.itemInstanceId,
                        this.state.selectedClass
                      );
                      weaponsEquipped = true;
                      break;
                    case 3:
                      await this.equipItem(
                        helmet.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        gauntlets.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        chestArmor.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        legArmor.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        classArmor.itemInstanceId,
                        this.state.selectedClass
                      );
                      armorEquipped = true;
                      break;
                    case 4:
                      await this.equipItem(
                        gauntlets.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        helmet.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        chestArmor.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        legArmor.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        classArmor.itemInstanceId,
                        this.state.selectedClass
                      );
                      armorEquipped = true;
                      break;
                    case 5:
                      await this.equipItem(
                        chestArmor.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        helmet.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        gauntlets.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        legArmor.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        classArmor.itemInstanceId,
                        this.state.selectedClass
                      );
                      armorEquipped = true;
                      break;
                    case 6:
                      await this.equipItem(
                        legArmor.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        helmet.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        gauntlets.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        chestArmor.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        classArmor.itemInstanceId,
                        this.state.selectedClass
                      );
                      armorEquipped = true;
                      break;
                    case 7:
                      await this.equipItem(
                        classArmor.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        helmet.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        gauntlets.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        chestArmor.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        legArmor.itemInstanceId,
                        this.state.selectedClass
                      );
                      armorEquipped = true;
                      break;
                  }
                }
              }
              if (!weaponsEquipped) {
                await this.equipItem(
                  kinetic.itemInstanceId,
                  this.state.selectedClass
                );
                await this.equipItem(
                  energy.itemInstanceId,
                  this.state.selectedClass
                );
                await this.equipItem(
                  power.itemInstanceId,
                  this.state.selectedClass
                );
                weaponsEquipped = true;
              }
              if (!armorEquipped) {
                await this.equipItem(
                  helmet.itemInstanceId,
                  this.state.selectedClass
                );
                await this.equipItem(
                  gauntlets.itemInstanceId,
                  this.state.selectedClass
                );
                await this.equipItem(
                  chestArmor.itemInstanceId,
                  this.state.selectedClass
                );
                await this.equipItem(
                  legArmor.itemInstanceId,
                  this.state.selectedClass
                );
                await this.equipItem(
                  classArmor.itemInstanceId,
                  this.state.selectedClass
                );
                armorEquipped = true;
              }
            }
          );
        }
        if (this.state.selectedClass == this.state.characters[2]) {
          this.setState(
            {
              kinetic: warlockInventory.filter(
                (item) => item.bucketHash == 1498876634
              ),
              energy: warlockInventory.filter(
                (item) => item.bucketHash == 2465295065
              ),
              power: warlockInventory.filter(
                (item) => item.bucketHash == 953998645
              ),
              helmet: warlockInventory.filter(
                (item) => item.bucketHash == 3448274439
              ),
              gauntlets: warlockInventory.filter(
                (item) => item.bucketHash == 3551918588
              ),
              chestArmor: warlockInventory.filter(
                (item) => item.bucketHash == 14239492
              ),
              legArmor: warlockInventory.filter(
                (item) => item.bucketHash == 20886954
              ),
              classArmor: warlockInventory.filter(
                (item) => item.bucketHash == 1585787867
              ),
            },
            async () => {
              let kinetic;
              let energy;
              let power;
              let helmet;
              let gauntlets;
              let chestArmor;
              let legArmor;
              let classArmor;
              const firstWeaponSlot = Math.floor(Math.random() * 3);
              let exoticWeapon = false;
              if (firstWeaponSlot == 0) {
                kinetic = this.setItem(this.state.kinetic, exoticWeapon);
                if (kinetic.dismantlePermission == 1) {
                  exoticWeapon = true;
                }
                const secondWeaponSlot = Math.floor(Math.random() * 2);
                if (secondWeaponSlot == 0) {
                  energy = this.setItem(this.state.energy, exoticWeapon);
                  if (energy.dismantlePermission == 1) {
                    exoticWeapon = true;
                  }
                  power = this.setItem(this.state.power, exoticWeapon);
                } else {
                  power = this.setItem(this.state.power, exoticWeapon);
                  if (power.dismantlePermission == 1) {
                    exoticWeapon = true;
                  }
                  energy = this.setItem(this.state.energy, exoticWeapon);
                }
              } else if (firstWeaponSlot == 1) {
                energy = this.setItem(this.state.energy, exoticWeapon);
                if (energy.dismantlePermission == 1) {
                  exoticWeapon = true;
                }
                const secondWeaponSlot = Math.floor(Math.random() * 2);
                if (secondWeaponSlot == 0) {
                  kinetic = this.setItem(this.state.kinetic, exoticWeapon);
                  if (kinetic.dismantlePermission == 1) {
                    exoticWeapon = true;
                  }
                  power = this.setItem(this.state.power, exoticWeapon);
                } else {
                  power = this.setItem(this.state.power, exoticWeapon);
                  if (power.dismantlePermission == 1) {
                    exoticWeapon = true;
                  }
                  kinetic = this.setItem(this.state.kinetic, exoticWeapon);
                }
              } else {
                power = this.setItem(this.state.power, exoticWeapon);
                if (power.dismantlePermission == 1) {
                  exoticWeapon = true;
                }
                const secondWeaponSlot = Math.floor(Math.random() * 2);
                if (secondWeaponSlot == 0) {
                  kinetic = this.setItem(this.state.kinetic, exoticWeapon);
                  if (kinetic.dismantlePermission == 1) {
                    exoticWeapon = true;
                  }
                  energy = this.setItem(this.state.energy, exoticWeapon);
                } else {
                  energy = this.setItem(this.state.energy, exoticWeapon);
                  if (energy.dismantlePermission == 1) {
                    exoticWeapon = true;
                  }
                  kinetic = this.setItem(this.state.kinetic, exoticWeapon);
                }
              }
              const firstArmorSlot = Math.floor(Math.random() * 5);
              let exoticArmor = false;
              if (firstArmorSlot == 0) {
                helmet = this.setItem(this.state.helmet, exoticArmor);
                if (helmet.dismantlePermission == 1) {
                  exoticArmor = true;
                }
                const secondArmorSlot = Math.floor(Math.random() * 4);
                if (secondArmorSlot == 0) {
                  gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                  if (gauntlets.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    chestArmor = this.setItem(
                      this.state.chestArmor,
                      exoticArmor
                    );
                    if (chestArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    if (legArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(this.state.classArmor);
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                    }
                  } else {
                    classArmor = this.setItem(
                      this.state.classArmor,
                      exoticArmor
                    );
                    if (classArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    } else {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    }
                  }
                } else if (secondArmorSlot == 1) {
                  chestArmor = this.setItem(this.state.chestArmor, exoticArmor);
                  if (chestArmor.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                    if (gauntlets.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    if (legArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(this.state.classArmor);
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    }
                  } else {
                    classArmor = this.setItem(
                      this.state.classArmor,
                      exoticArmor
                    );
                    if (classArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    } else {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    }
                  }
                } else if (secondArmorSlot == 2) {
                  legArmor = this.setItem(this.state.legArmor, exoticArmor);
                  if (legArmor.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    chestArmor = this.setItem(
                      this.state.chestArmor,
                      exoticArmor
                    );
                    if (chestArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    }
                  } else if (thirdArmorSlot == 1) {
                    gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                    if (gauntlets.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(this.state.classArmor);
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                    }
                  } else {
                    classArmor = this.setItem(
                      this.state.classArmor,
                      exoticArmor
                    );
                    if (classArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    } else {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    }
                  }
                } else {
                  classArmor = this.setItem(this.state.classArmor, exoticArmor);
                  if (classArmor.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    chestArmor = this.setItem(
                      this.state.chestArmor,
                      exoticArmor
                    );
                    if (chestArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    } else {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    if (legArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    } else {
                      gauntlets = this.setItem(this.state.gauntlets);
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                    }
                  } else {
                    gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                    if (gauntlets.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    } else {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    }
                  }
                }
              } else if (firstArmorSlot == 1) {
                gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                if (gauntlets.dismantlePermission == 1) {
                  exoticArmor = true;
                }
                const secondArmorSlot = Math.floor(Math.random() * 4);
                if (secondArmorSlot == 0) {
                  helmet = this.setItem(this.state.helmet, exoticArmor);
                  if (helmet.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    chestArmor = this.setItem(
                      this.state.chestArmor,
                      exoticArmor
                    );
                    if (chestArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    if (legArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(this.state.classArmor);
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                    }
                  } else {
                    classArmor = this.setItem(
                      this.state.classArmor,
                      exoticArmor
                    );
                    if (classArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    } else {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    }
                  }
                } else if (secondArmorSlot == 1) {
                  chestArmor = this.setItem(this.state.chestArmor, exoticArmor);
                  if (chestArmor.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    helmet = this.setItem(this.state.helmet, exoticArmor);
                    if (helmet.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    if (legArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(this.state.classArmor);
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    }
                  } else {
                    classArmor = this.setItem(
                      this.state.classArmor,
                      exoticArmor
                    );
                    if (classArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    } else {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    }
                  }
                } else if (secondArmorSlot == 2) {
                  legArmor = this.setItem(this.state.legArmor, exoticArmor);
                  if (legArmor.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    chestArmor = this.setItem(
                      this.state.chestArmor,
                      exoticArmor
                    );
                    if (chestArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    helmet = this.setItem(this.state.helmet, exoticArmor);
                    if (helmet.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(this.state.classArmor);
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                    }
                  } else {
                    classArmor = this.setItem(
                      this.state.classArmor,
                      exoticArmor
                    );
                    if (classArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    } else {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    }
                  }
                } else if (secondArmorSlot == 3) {
                  classArmor = this.setItem(this.state.classArmor, exoticArmor);
                  if (classArmor.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    chestArmor = this.setItem(
                      this.state.chestArmor,
                      exoticArmor
                    );
                    if (chestArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    } else {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    if (legArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    } else {
                      helmet = this.setItem(this.state.helmet);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                    }
                  } else {
                    helmet = this.setItem(this.state.helmet, exoticArmor);
                    if (helmet.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    } else {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(this.state.helmet, exoticArmor);
                    }
                  }
                }
              } else if (firstArmorSlot == 2) {
                chestArmor = this.setItem(this.state.chestArmor, exoticArmor);
                if (chestArmor.dismantlePermission == 1) {
                  exoticArmor = true;
                }
                const secondArmorSlot = Math.floor(Math.random() * 4);
                if (secondArmorSlot == 0) {
                  gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                  if (gauntlets.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    helmet = this.setItem(this.state.helmet, exoticArmor);
                    if (helmet.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    if (legArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(this.state.classArmor);
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    }
                  } else {
                    classArmor = this.setItem(
                      this.state.classArmor,
                      exoticArmor
                    );
                    if (classArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    } else {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.classArmor, exoticArmor);
                    }
                  }
                } else if (secondArmorSlot == 1) {
                  helmet = this.setItem(this.state.helmet, exoticArmor);
                  if (helmet.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                    if (gauntlets.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    if (legArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(this.state.classArmor);
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    }
                  } else {
                    classArmor = this.setItem(
                      this.state.classArmor,
                      exoticArmor
                    );
                    if (classArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    } else {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    }
                  }
                } else if (secondArmorSlot == 2) {
                  legArmor = this.setItem(this.state.legArmor, exoticArmor);
                  if (legArmor.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    helmet = this.setItem(this.state.helmet, exoticArmor);
                    if (helmet.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    }
                  } else if (thirdArmorSlot == 1) {
                    gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                    if (gauntlets.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(this.state.classArmor);
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    }
                  } else {
                    classArmor = this.setItem(
                      this.state.classArmor,
                      exoticArmor
                    );
                    if (classArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    } else {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.classArmor, exoticArmor);
                    }
                  }
                } else if (secondArmorSlot == 3) {
                  classArmor = this.setItem(this.state.classArmor, exoticArmor);
                  if (classArmor.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    helmet = this.setItem(this.state.helmet, exoticArmor);
                    if (helmet.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    } else {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    if (legArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    } else {
                      gauntlets = this.setItem(this.state.gauntlets);
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    }
                  } else {
                    gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                    if (gauntlets.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    } else {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.gauntlets, exoticArmor);
                    }
                  }
                }
              } else if (firstArmorSlot == 3) {
                legArmor = this.setItem(this.state.legArmor, exoticArmor);
                if (legArmor.dismantlePermission == 1) {
                  exoticArmor = true;
                }
                const secondArmorSlot = Math.floor(Math.random() * 4);
                if (secondArmorSlot == 0) {
                  gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                  if (gauntlets.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    chestArmor = this.setItem(
                      this.state.chestArmor,
                      exoticArmor
                    );
                    if (chestArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    helmet = this.setItem(this.state.helmet, exoticArmor);
                    if (helmet.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(this.state.classArmor);
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                    }
                  } else {
                    classArmor = this.setItem(
                      this.state.classArmor,
                      exoticArmor
                    );
                    if (classArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    } else {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    }
                  }
                } else if (secondArmorSlot == 1) {
                  chestArmor = this.setItem(this.state.chestArmor, exoticArmor);
                  if (chestArmor.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                    if (gauntlets.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    helmet = this.setItem(this.state.helmet, exoticArmor);
                    if (helmet.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(this.state.classArmor);
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    }
                  } else {
                    classArmor = this.setItem(
                      this.state.classArmor,
                      exoticArmor
                    );
                    if (classArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    } else {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    }
                  }
                } else if (secondArmorSlot == 2) {
                  helmet = this.setItem(this.state.helmet, exoticArmor);
                  if (helmet.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    chestArmor = this.setItem(
                      this.state.chestArmor,
                      exoticArmor
                    );
                    if (chestArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    }
                  } else if (thirdArmorSlot == 1) {
                    gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                    if (gauntlets.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      classArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    } else {
                      classArmor = this.setItem(this.state.classArmor);
                      if (classArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                    }
                  } else {
                    classArmor = this.setItem(
                      this.state.classArmor,
                      exoticArmor
                    );
                    if (classArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    } else {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.classArmor,
                        exoticArmor
                      );
                    }
                  }
                } else if (secondArmorSlot == 3) {
                  classArmor = this.setItem(this.state.classArmor, exoticArmor);
                  if (classArmor.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    chestArmor = this.setItem(
                      this.state.chestArmor,
                      exoticArmor
                    );
                    if (chestArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    } else {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    helmet = this.setItem(this.state.helmet, exoticArmor);
                    if (helmet.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    } else {
                      gauntlets = this.setItem(this.state.gauntlets);
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                    }
                  } else {
                    gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                    if (gauntlets.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    } else {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    }
                  }
                }
              } else {
                classArmor = this.setItem(this.state.classArmor, exoticArmor);
                if (classArmor.dismantlePermission == 1) {
                  exoticArmor = true;
                }
                const secondArmorSlot = Math.floor(Math.random() * 4);
                if (secondArmorSlot == 0) {
                  gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                  if (gauntlets.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    chestArmor = this.setItem(
                      this.state.chestArmor,
                      exoticArmor
                    );
                    if (chestArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    } else {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    if (legArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    } else {
                      helmet = this.setItem(this.state.helmet);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                    }
                  } else {
                    helmet = this.setItem(this.state.helmet, exoticArmor);
                    if (helmet.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    } else {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(this.state.helmet, exoticArmor);
                    }
                  }
                } else if (secondArmorSlot == 1) {
                  chestArmor = this.setItem(this.state.chestArmor, exoticArmor);
                  if (chestArmor.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                    if (gauntlets.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    } else {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    if (legArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    } else {
                      helmet = this.setItem(this.state.helmet);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    }
                  } else {
                    helmet = this.setItem(this.state.helmet, exoticArmor);
                    if (helmet.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    } else {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    }
                  }
                } else if (secondArmorSlot == 2) {
                  legArmor = this.setItem(this.state.legArmor, exoticArmor);
                  if (legArmor.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    chestArmor = this.setItem(
                      this.state.chestArmor,
                      exoticArmor
                    );
                    if (chestArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    } else {
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    }
                  } else if (thirdArmorSlot == 1) {
                    gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                    if (gauntlets.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      helmet = this.setItem(this.state.helmet, exoticArmor);
                    } else {
                      helmet = this.setItem(this.state.helmet);
                      if (helmet.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                    }
                  } else {
                    helmet = this.setItem(this.state.helmet, exoticArmor);
                    if (helmet.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    } else {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(this.state.helmet, exoticArmor);
                    }
                  }
                } else if (secondArmorSlot == 3) {
                  helmet = this.setItem(this.state.helmet, exoticArmor);
                  if (helmet.dismantlePermission == 1) {
                    exoticArmor = true;
                  }
                  const thirdArmorSlot = Math.floor(Math.random() * 3);
                  if (thirdArmorSlot == 0) {
                    chestArmor = this.setItem(
                      this.state.chestArmor,
                      exoticArmor
                    );
                    if (chestArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    } else {
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    }
                  } else if (thirdArmorSlot == 1) {
                    legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    if (legArmor.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      gauntlets = this.setItem(
                        this.state.gauntlets,
                        exoticArmor
                      );
                    } else {
                      gauntlets = this.setItem(this.state.gauntlets);
                      if (gauntlets.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                    }
                  } else {
                    gauntlets = this.setItem(this.state.gauntlets, exoticArmor);
                    if (gauntlets.dismantlePermission == 1) {
                      exoticArmor = true;
                    }
                    const fourthArmorSlot = Math.floor(Math.random() * 2);
                    if (fourthArmorSlot == 0) {
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                      if (chestArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                    } else {
                      legArmor = this.setItem(this.state.legArmor, exoticArmor);
                      if (legArmor.dismantlePermission == 1) {
                        exoticArmor = true;
                      }
                      chestArmor = this.setItem(
                        this.state.chestArmor,
                        exoticArmor
                      );
                    }
                  }
                }
              }
              let weaponsEquipped = false;
              let armorEquipped = false;
              for (let i = 0; i < 8; i++) {
                if (warlockEquipped[i].dismantlePermission == 1) {
                  switch (i) {
                    case 0:
                      await this.equipItem(
                        kinetic.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        energy.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        power.itemInstanceId,
                        this.state.selectedClass
                      );
                      weaponsEquipped = true;
                      break;
                    case 1:
                      await this.equipItem(
                        energy.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        kinetic.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        power.itemInstanceId,
                        this.state.selectedClass
                      );
                      weaponsEquipped = true;
                      break;
                    case 2:
                      await this.equipItem(
                        power.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        kinetic.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        energy.itemInstanceId,
                        this.state.selectedClass
                      );
                      weaponsEquipped = true;
                      break;
                    case 3:
                      await this.equipItem(
                        helmet.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        gauntlets.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        chestArmor.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        legArmor.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        classArmor.itemInstanceId,
                        this.state.selectedClass
                      );
                      armorEquipped = true;
                      break;
                    case 4:
                      await this.equipItem(
                        gauntlets.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        helmet.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        chestArmor.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        legArmor.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        classArmor.itemInstanceId,
                        this.state.selectedClass
                      );
                      armorEquipped = true;
                      break;
                    case 5:
                      await this.equipItem(
                        chestArmor.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        helmet.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        gauntlets.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        legArmor.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        classArmor.itemInstanceId,
                        this.state.selectedClass
                      );
                      armorEquipped = true;
                      break;
                    case 6:
                      await this.equipItem(
                        legArmor.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        helmet.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        gauntlets.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        chestArmor.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        classArmor.itemInstanceId,
                        this.state.selectedClass
                      );
                      armorEquipped = true;
                      break;
                    case 7:
                      await this.equipItem(
                        classArmor.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        helmet.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        gauntlets.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        chestArmor.itemInstanceId,
                        this.state.selectedClass
                      );
                      await this.equipItem(
                        legArmor.itemInstanceId,
                        this.state.selectedClass
                      );
                      armorEquipped = true;
                      break;
                  }
                }
              }
              if (!weaponsEquipped) {
                await this.equipItem(
                  kinetic.itemInstanceId,
                  this.state.selectedClass
                );
                await this.equipItem(
                  energy.itemInstanceId,
                  this.state.selectedClass
                );
                await this.equipItem(
                  power.itemInstanceId,
                  this.state.selectedClass
                );
                weaponsEquipped = true;
              }
              if (!armorEquipped) {
                await this.equipItem(
                  helmet.itemInstanceId,
                  this.state.selectedClass
                );
                await this.equipItem(
                  gauntlets.itemInstanceId,
                  this.state.selectedClass
                );
                await this.equipItem(
                  chestArmor.itemInstanceId,
                  this.state.selectedClass
                );
                await this.equipItem(
                  legArmor.itemInstanceId,
                  this.state.selectedClass
                );
                await this.equipItem(
                  classArmor.itemInstanceId,
                  this.state.selectedClass
                );
                armorEquipped = true;
              }
            }
          );
        }
      }
    );
  }
  render() {
    return (
      <div>
        <h1>Welcome {this.state.displayName}</h1>
        <select onChange={this.handleClassChange}>
          <option value="default">Choose a Class</option>
          <option value="titan">Titan</option>
          <option value="hunter">Hunter</option>
          <option value="warlock">Warlock</option>
        </select>
        <button onClick={this.handleClick}>{this.state.buttonState}</button>
      </div>
    );
  }
}

export default Randomizer;
