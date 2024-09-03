import './App.css';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { observable } from 'mobx';
import { Button, Tooltip } from "@mui/material";
import { allSkills } from './allSkills';
import { allHeroes } from './allHeroes';

/* START MobX BLOCK */
const store = observable({
  pool: [],
  limit: 6,
  generalistCount: [0, 0, 0, 0],
  generalistRune: false,
  extra: false,
  minus: false,
  debuffs: true,
  buffs: true,
  traits: false,
  types: false,
  filter: 'All',
  changeFilter (val)  {
    this.filter = val;
  },
  showIcons (val)  {
    switch(val) {
      case "debuffs": this.debuffs = !this.debuffs; break;
      case "buffs": this.buffs = !this.buffs; break;
      case "traits": this.traits = !this.traits; break;
      case "types": this.types = !this.types; break;
      default: break;
    }
  },
  runes (val) {
    if (val === "extra")  {
      this.extra = !this.extra;
      this.extra ? this.limit += 1 : this.limit -= 1;
    }
    if (val === "minus") {
      this.minus = !this.minus;
      this.minus ? this.limit -= 3 : this.limit += 3;
    }
    if (val === "generalist") {
      this.generalistRune = !this.generalistRune;
      if (this.generalistRune) this.generalist(1, 4);
    }
  },
  generalist (stage, stageEnd)  {
    if (stage !== 5 && this.generalistRune) {
      for (let i = stage; i <= stageEnd; i++) {
        let typesPool = [];
        this.pool.forEach((e) =>  {
          if (e.stage === i) typesPool = [...new Set(typesPool.concat(e.allTypes))];
        })
        this.generalistCount[i-1] = typesPool.length*1.5;
      }
    }
  },
  add (name, arr) {
    if (this.pool.filter((e) => e.name === name.name).length < 1) {
      for (let i = 1; i <= 4; i++)  {
        if (this.pool.filter((e) => e.stage === i).length < this.limit) {
          this.pool.push({...name, arr: arr, stage: i});
          allSkills.get(name.name).opacity = 0.2;
          this.generalist(i, i);
          break;
        }
      }
    }
  },
  delete (name, stage)  {
    this.pool = this.pool.filter((e) => e.name !== name);
    allSkills.get(name).opacity = 1;
    this.generalist(stage, stage);
  },
  banish (name, arr) {
    if (this.pool.filter((e) => e.stage === 5).length < 10 && this.pool.filter(e => e.name === name.name).length < 1)  {
      this.pool.push({...name, arr: arr, stage: 5});
      allSkills.get(name.name).opacity = 0.2;
    }
  },
  reset ()  {
    this.pool = [];
    this.generalistCount = [0, 0, 0, 0];
    allSkills.forEach((e) => e.opacity = 1);
  },

});
/* END MobX BLOCK */ 

/* START COMPONENTS BLOCK */
function Skills ({arr}) {
  let arrType;
  if (arr === "weapons") arrType = allHeroes.get(store.filter).wArray;
  if (arr === "skills") arrType = allHeroes.get(store.filter).sArray;
  return  (
    arrType.map((e, idx) => {
      const getSkill = allSkills.get(e);
      return (
        <div key={idx} style={{textAlign: "center", marginRight: "10px", marginBottom: "15px", opacity: allSkills.get(e).opacity}}>
          <Tooltip placement="top" title={<span className="tooltipInfo">{getSkill.name}</span>} followCursor>
            <Button variant="text" size="medium" className='allImgs'
            style={{backgroundImage: `url('/img/${arr}/${getSkill.name.replaceAll(' ', '')}.webp')`, backgroundSize: "cover", height:"65px"}}
            onClick={() => store.add(getSkill, arr)}
            onContextMenu={() => store.banish(getSkill, arr)}>
            {(store.types && getSkill.types.length > 0) &&
            <div style={{position: "absolute", right: "-15%", top: "-15%"}}>
              {getSkill.types.map((b, ix) => {
                return <img key={ix} width="25px" height="25px" src={`img/types/${b}.png`} title={b} alt="no" />
              })}
            </div>}
            </Button>
          </Tooltip>
          {(store.debuffs && getSkill.debuffs.length > 0) &&
          <div className='buffDiv'>
            {getSkill.debuffs.map((b, ix) => {
              return <img key={ix} width="60px" height="60px" src={`/img/debuffs/${b}.png`} title={b} alt="no"/>
            })}
          </div>}
          {(store.buffs && getSkill.buffs.length > 0) &&
          <div className='buffDiv'>
            {getSkill.buffs.map((b, ix) => {
              return <img key={ix} width="60px" height="60px" src={`/img/buffs/${b}.png`} title={b} alt="no"/>
            })}
          </div>}
          {(store.traits && getSkill.traits.length > 0) &&
          <div className='buffDiv' style={{marginTop: "-3px"}}>
            {getSkill.traits.map((b, ix) => {
              return <img key={ix} width="60px" height="60px" src={`/img/traits/${b}.png`} title={b} alt="no"/>
            })}
          </div>}
        </div>
      )
    })
  )
}

function Stage ({num}) {
  return (
    <>
      {num !== 5 
        ? <div className='title'>{'Stage ' + num} ({store.pool.filter((e) => e.stage === num).length} / {store.limit})</div>
        : <div className='title'>Banished ({store.pool.filter((e) => e.stage === 5).length} / 10)</div>}
      {(store.generalistRune && num !== 5) &&
      <div style={{display: "flex", justifyContent: "center", fontSize: "15pt", marginBottom: "5px", color: "yellow"}}>+ {store.generalistCount[num-1]}% dmg</div>}
      <div className='stages'>
        {store.pool.filter((e) => e.stage === num).map((i, idx) => {
          return  (
            <div key={idx} style={{textAlign: "center", marginRight: "5px", marginBottom: "5px"}}>
              <Tooltip placement="top" title={<span className="tooltipInfo">{i.name}</span>} followCursor>
                <Button variant="text" size="medium" className='allImgs'
                style={{backgroundImage: `url('/img/${i.arr}/${i.name.replaceAll(' ', '')}.webp')`, backgroundSize: "cover", height:"65px"}}
                onClick={() => store.delete(i.name, num)}>
                {(store.types && i.types.length > 0) &&
                <div style={{position: "absolute", right: "-8%", top: "-15%"}}>
                  {i.types.map((b, ix) => {
                    return <img key={ix} width="25px" height="25px" src={`img/types/${b}.png`} title={b} alt="no" />
                  })}
                </div>}
                </Button>
              </Tooltip>
              {(store.debuffs && i.debuffs.length > 0) &&
              <div className='buffDiv'>
                {i.debuffs.map((b, ix) => {
                  return <img key={ix} width="60px" height="60px" src={`/img/debuffs/${b}.png`} title={b} alt="no"/>
                })}          
              </div>}
              {(store.buffs && i.buffs.length > 0) &&
              <div className='buffDiv'>
                {i.buffs.map((b, ix) => {
                  return <img key={ix} width="60px" height="60px" src={`/img/buffs/${b}.png`} title={b} alt="no"/>
                })}          
              </div>}
              {(store.traits && i.traits.length > 0) &&
              <div className='buffDiv' style={{marginTop: "-3px"}}>
                {i.traits.map((b, ix) => {
                  return <img key={ix} width="60px" height="60px" src={`/img/traits/${b}.png`} title={b} alt="no"/>
                })}
              </div>}
            </div>
          )
        })}
      </div>
    </>
  )
}
/* END COMPONENTS BLOCK */

function App() {

  document.oncontextmenu = () => {
    return false;
  }

  const charactersList = Array.from(allHeroes.keys()).map((i, idx) => {
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
                <input type="checkbox" checked={store.extra} onChange={() => store.runes("extra")} />
                <img src={`/img/runes/ImprovedRepetory.png`} alt="no" />
              </label>
            </Tooltip>
            <Tooltip placement="top" title={<span className="tooltipInfo">Focused Mind</span>} followCursor>
              <label className='runeLabel'>
                <input type="checkbox" checked={store.minus} onChange={() => store.runes("minus")} />
                <img src={`/img/runes/FocusedMind.png`} alt="no" />
              </label>
            </Tooltip>
            <Tooltip placement="top" title={<span className="tooltipInfo">Generalist</span>} followCursor>
              <label className='runeLabel'>
                <input type="checkbox" checked={store.generalistRune} onChange={() => store.runes("generalist")} />
                <img src={`/img/runes/Generalist.png`} alt="no" />
              </label>
            </Tooltip>
          </div>}
        </div>
        <div className='center'>
          {(store.filter !== "All") && 
            <div className='stack'>
              <label className='iconsLabel'>
                <input style={{width: "16pt", height: "16pt"}} type="checkbox" checked={store.debuffs} onChange={() => store.showIcons("debuffs")} />
                <span>Debuffs</span>
              </label>
              <label className='iconsLabel'>
                <input style={{width: "16pt", height: "16pt"}} type="checkbox" checked={store.buffs} onChange={() => store.showIcons("buffs")} />
                <span>Stackable Buffs</span>
              </label>
              <label className='iconsLabel'>
                <input style={{width: "16pt", height: "16pt"}} type="checkbox" checked={store.traits} onChange={() => store.showIcons("traits")} />
                <span>Traits</span>
              </label>
              <label className='iconsLabel'>
                <input style={{width: "16pt", height: "16pt"}} type="checkbox" checked={store.types} onChange={() => store.showIcons("types")} />
                <span>Skill Types</span>
              </label>
            </div>}
          {(store.filter === "All") && <div style={{fontSize: "35px", textAlign: "center"}}>Choose your character</div>}
          {(store.filter !== "All") && <div style={{marginBottom: "10px"}} className="items"><Skills arr={"weapons"} /></div>}
          {(store.filter !== "All") && <div className="items"><Skills arr={"skills"} /></div>}
        </div>
        <div className='right'>
          <Stage num={1} />
          <Stage num={2} />
          <Stage num={3} />
          <Stage num={4} />
          <Stage num={5} />
          {(store.pool.length > 0) && 
          <div>
            <Button style={{marginTop: "10px"}} color="error" onClick={() => store.reset()} variant='contained'>RESET BUILD</Button>
          </div>}
        </div>
      </div>
    </>
  );
}
export default observer(App);