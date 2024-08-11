import './App.css';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { observable } from 'mobx';
import { Button, Tooltip } from "@mui/material";
import { all } from "./heroes";


export const store = observable({
  stage1: [],
  stage2: [],
  stage3: [],
  stage4: [],
  banished: [],
  runeSeven: 6,
  check: false,
  filter: 'All',
  heroesFilters: ["barbarian", "pyromancer", "houndmaster", "spellblade", "arcaneweaver", "sentinel", "paladin", "chaoswalker",
  "beastmaster", "assassin", "elementalist", "legionnaire", "necromancer", "deathknight", "monkeyking", "engineer", "myrmidon"],
  changeFilter (value)  {
    this.filter = value;
  },
  changeCheck () {
    this.check = !this.check;
    if (this.runeSeven === 6) {
      this.runeSeven = 7;
    } else  {
      this.runeSeven = 6;
    }
  },
  sOpacity (name) {
    all.forEach((e) => e.sArray.forEach((i) => {
      if (i.sName === name && i.opacity !== 0.2)  {
        i.opacity = 0.2;
      }
    }));
  },
  add (name, img, arr) {
    if (arr === "weapons")  {
      all.forEach((e) => e.wArray.forEach((i) => {
        if (i.wName === name && i.opacity !== 0.2)  {
          if (this.stage1.length < this.runeSeven) {
            this.stage1.push({name: name, img: img, arr: arr});
            i.opacity = 0.2;
          } else if (this.stage2.length < this.runeSeven)  {
            this.stage2.push({name: name, img: img, arr: arr});
            i.opacity = 0.2;
          } else if (this.stage3.length < this.runeSeven)  {
            this.stage3.push({name: name, img: img, arr: arr});
            i.opacity = 0.2;
          } else if (this.stage4.length < this.runeSeven)  {
            this.stage4.push({name: name, img: img, arr: arr});
            i.opacity = 0.2;
          }
        }
      }));
    } else if (arr === "skills") {
      if (this.banished.filter((e) => e.name === name).length < 1 && this.stage1.filter(e => e.name === name).length < 1 && this.stage2.filter(e => e.name === name).length < 1 && this.stage3.filter(e => e.name === name).length < 1 && this.stage4.filter(e => e.name === name).length < 1)  {
        if (this.stage1.length < this.runeSeven) {
          this.stage1.push({name: name, img: img, arr: arr});
          this.sOpacity(name);
        } else if (this.stage2.length < this.runeSeven)  {
          this.stage2.push({name: name, img: img, arr: arr});
          this.sOpacity(name);
        } else if (this.stage3.length < this.runeSeven)  {
          this.stage3.push({name: name, img: img, arr: arr});
          this.sOpacity(name);
        } else if (this.stage4.length < this.runeSeven)  {
          this.stage4.push({name: name, img: img, arr: arr});
          this.sOpacity(name);
        }
      }
    }
  },
  delete (name, num, arr)  {
    if (num === 1)  {
      this.stage1 = this.stage1.filter((e) => e.name !== name);
    } else if (num === 2) {
      this.stage2 = this.stage2.filter((e) => e.name !== name);
    } else if (num === 3) {
      this.stage3 = this.stage3.filter((e) => e.name !== name);
    } else if (num === 4) {
      this.stage4 = this.stage4.filter((e) => e.name !== name);
    } else if (num === 5) {
      this.banished = this.banished.filter((e) => e.name !== name);
    }
    if (arr === "weapons")  {
      all.forEach((e) => e.wArray.forEach((i) => {
        if (i.wName === name)  {
          i.opacity = 1;
        }
      }));
    } else if (arr === "skills")  {
      all.forEach((e) => e.sArray.forEach((i) => {
        if (i.sName === name)  {
          i.opacity = 1;
        }
      }));
    }
  },
  banish (name, img, arr) {
    if (this.banished.length < 10 && 
      this.banished.filter((e) => e.name === name).length < 1 && 
      this.stage1.filter(e => e.name === name).length < 1 && this.stage2.filter(e => e.name === name).length < 1 && 
      this.stage3.filter(e => e.name === name).length < 1 && this.stage4.filter(e => e.name === name).length < 1)  {
      this.banished.push({name: name, img: img, arr: arr});
      if (arr === "weapons")  {
        all.forEach((e) => e.wArray.forEach((i) => {
          if (i.wName === name)  {
            i.opacity = 0.2;
          }
        }));
      } else if (arr === "skills")  {
        all.forEach((e) => e.sArray.forEach((i) => {
          if (i.sName === name)  {
            i.opacity = 0.2;
          }
        }));
      }
    }
  },
  reset ()  {
    this.stage1 = this.stage2 = this.stage3 = this.stage4 = this.banished = [];
    all.forEach((e) => e.wArray.forEach((i) => {
      i.opacity = 1;
    }));
    all.forEach((e) => e.sArray.forEach((i) => {
      i.opacity = 1;
    }));
  },


});


function App() {

  document.oncontextmenu = cmenu;
  function cmenu () {
    return false;
  }

  const charactersList = store.heroesFilters.map((i, idx) => {
    return (
      <div key={idx} style={{margin: "10px"}}>
        <Tooltip placement="top" title={<span className="tooltipInfo">{i.charAt(0).toUpperCase() + i.slice(1)}</span>} followCursor>
        <label className="heroes">
          <input type='radio' name='filter' value={i} onChange={(e) => store.changeFilter(e.target.value)} />
          <img className='allImgs' src={`/img/heroes/${i}.webp`} alt="no"/>
        </label>
        </Tooltip>
      </div>
    );
  });
/*
  const weaponsList = weapons.map((i, idx) => {
    return (
      <div key={idx} style={{marginRight: "5px", marginBottom: "5px"}}>
        <Tooltip placement="top" title={<span className="tooltipInfo">{i.name}</span>} followCursor>
        <Button variant="text" size="medium" className='allImgs'
        style={{backgroundImage: `url('/img/weapons/${i.img}.png')`, backgroundSize: "cover", height:"65px"}}>
        </Button>
        </Tooltip>
      </div>
    );
  });

  const skillsList = skills.map((i, idx) => {
    return (
      <div key={idx} style={{marginRight: "5px", marginBottom: "5px"}}>
        <Tooltip placement="top" title={<span className="tooltipInfo">{i.name}</span>} followCursor>
        <Button variant="text" size="medium" className='allImgs'
        style={{backgroundImage: `url('/img/skills/${i.img}.png')`, backgroundSize: "cover", height:"65px"}}>
        </Button>
        </Tooltip>
      </div>
    );
  });
*/

  const wList = all.filter ((a) => a.hero === store.filter).map((i) => i.wArray.map((e, ind) => {
    return (
      <div key={ind} style={{marginRight: "5px", marginBottom: "5px", opacity: e.opacity}}>
        <Tooltip placement="top" title={<span className="tooltipInfo">{e.wName}</span>} followCursor>
        <Button variant="text" size="medium" className='allImgs'
        style={{backgroundImage: `url('/img/weapons/${e.wImg}.webp')`, backgroundSize: "cover", height:"65px"}}
        onClick={() => store.add(e.wName, e.wImg, "weapons")}
        onContextMenu={() => store.banish(e.wName, e.wImg, "weapons")}>
        </Button>
        </Tooltip>
      </div>
    )
  }))

  const sList = all.filter ((a) => a.hero === store.filter).map((i) => i.sArray.map((e, ind) => {
    return (
      <div key={ind} style={{marginRight: "5px", marginBottom: "5px", opacity: e.opacity}}>
        <Tooltip placement="top" title={<span className="tooltipInfo">{e.sName}</span>} followCursor>
        <Button variant="text" size="medium" className='allImgs'
        style={{backgroundImage: `url('/img/skills/${e.sName.replaceAll(' ', '')}.webp')`, backgroundSize: "cover", height:"65px"}}
        onClick={() => store.add(e.sName, e.sName.replaceAll(' ', ''), "skills")}
        onContextMenu={() => store.banish(e.sName, e.sName.replaceAll(' ', ''), "skills")}>
        </Button>
        </Tooltip>
      </div>
    )
  }))

  const stage1 = store.stage1.map((i, idx) => {
    return  (
      <div key={idx} style={{marginRight: "5px", marginBottom: "5px"}}>
        <Tooltip placement="top" title={<span className="tooltipInfo">{i.name}</span>} followCursor>
        <Button variant="text" size="medium" className='allImgs'
        style={{backgroundImage: `url('/img/${i.arr}/${i.img}.webp')`, backgroundSize: "cover", height:"65px"}}
        onClick={() => store.delete(i.name, 1, i.arr)}>
        </Button>
        </Tooltip>
      </div>
    )
  })

  const stage2 = store.stage2.map((i, idx) => {
    return  (
      <div key={idx} style={{marginRight: "5px", marginBottom: "5px"}}>
        <Tooltip placement="top" title={<span className="tooltipInfo">{i.name}</span>} followCursor>
        <Button variant="text" size="medium" className='allImgs'
        style={{backgroundImage: `url('/img/${i.arr}/${i.img}.webp')`, backgroundSize: "cover", height:"65px"}}
        onClick={() => store.delete(i.name, 2, i.arr)}>
        </Button>
        </Tooltip>
      </div>
    )
  })

  const stage3 = store.stage3.map((i, idx) => {
    return  (
      <div key={idx} style={{marginRight: "5px", marginBottom: "5px"}}>
        <Tooltip placement="top" title={<span className="tooltipInfo">{i.name}</span>} followCursor>
        <Button variant="text" size="medium" className='allImgs'
        style={{backgroundImage: `url('/img/${i.arr}/${i.img}.webp')`, backgroundSize: "cover", height:"65px"}}
        onClick={() => store.delete(i.name, 3, i.arr)}>
        </Button>
        </Tooltip>
      </div>
    )
  })

  const stage4 = store.stage4.map((i, idx) => {
    return  (
      <div key={idx} style={{marginRight: "5px", marginBottom: "5px"}}>
        <Tooltip placement="top" title={<span className="tooltipInfo">{i.name}</span>} followCursor>
        <Button variant="text" size="medium" className='allImgs'
        style={{backgroundImage: `url('/img/${i.arr}/${i.img}.webp')`, backgroundSize: "cover", height:"65px"}}
        onClick={() => store.delete(i.name, 4, i.arr)}>
        </Button>
        </Tooltip>
      </div>
    )
  })

  const banish = store.banished.map((i, idx) => {
    return  (
      <div key={idx} style={{marginRight: "5px", marginBottom: "5px"}}>
        <Tooltip placement="top" title={<span className="tooltipInfo">{i.name}</span>} followCursor>
        <Button variant="text" size="medium" className='allImgs'
        style={{backgroundImage: `url('/img/${i.arr}/${i.img}.webp')`, backgroundSize: "cover", height:"65px"}}
        onClick={() => store.delete(i.name, 5, i.arr)}>
        </Button>
        </Tooltip>
      </div>
    )
  })

  return (
    <>
    <div className="mainTitle" align="center">Soulstone Survivors The Unholy Cathedral Build Planner by Solxnx</div>
      <div className="parent">
        <div className='left'>
          <div className='cList'>{charactersList}</div>
          {(store.filter !== "All") && 
          <div className='rList'>
            <Tooltip placement="top" title={<span className="tooltipInfo">Improved Repetory</span>} followCursor>
            <label className='runeLabel'>
              <input type="checkbox" checked={store.check} onChange={() => store.changeCheck()} />
              <img src={`/img/runes/extraSkill.png`} alt="no" />
            </label>
            </Tooltip>
          </div>}
        </div>
        <div className='center'>
          {(store.filter === "All" && store.stage1.length < 1 && store.stage2.length < 1 && store.stage3.length < 1 && store.stage4.length < 1) && 
          <div style={{fontSize: "35px", textAlign: "center"}}>Choose your character</div>}
          {(store.filter !== "All") && <div style={{marginBottom: "15px"}} className="items">{wList}</div>}
          {(store.filter !== "All") && <div className="items">{sList}</div>}
        </div>
        <div className='right'>
          <div className='title'>Stage 1 ({store.stage1.length} / {store.runeSeven})</div>
          <div className='stages'>{stage1}</div>
          <div className='title'>Stage 2 ({store.stage2.length} / {store.runeSeven})</div>
          <div className='stages'>{stage2}</div>
          <div className='title'>Stage 3 ({store.stage3.length} / {store.runeSeven})</div>
          <div className='stages'>{stage3}</div>
          <div className='title'>Stage 4 ({store.stage4.length} / {store.runeSeven})</div>
          <div className='stages'>{stage4}</div>
          <div className='title'>Banished ({store.banished.length} / 10)</div>
          <div className='stages'>{banish}</div>
          {(store.stage1.length > 0 || store.stage2.length > 0 || store.stage3.length > 0 || store.stage4.length > 0 || store.banished.length > 0) && 
          <div>
            <Button style={{marginTop: "10px"}} color="error" onClick={() => store.reset()} variant='contained'>RESET BUILD</Button>
          </div>}
        </div>
      </div>

    </>
  );
}
export default observer(App);