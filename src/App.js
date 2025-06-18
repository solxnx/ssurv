import './App.css';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { observable } from 'mobx';
import { Button, Tooltip } from "@mui/material";
import { allSkills } from './allSkills';
import { allHeroes } from './allHeroes';
import { titans } from './titanHunt';
import { titanSkills } from './titanHunt';

/* START MobX BLOCK */
const store = observable({
  pool: [],
  mode: "cathedral",
  limit: 6,
  generalistCount: [0, 0, 0, 0],
  synchronyCount: [0, 0, 0, 0],
  runes: {ImprovedRepetory: false, FocusedMind: false, Generalist: false, Synchrony: false, SingularFocus: false, DevastatingBlow: false},
  icons: {debuffs: true, buffs: true, traits: false, types: false},
  filter: 'All',
  titanFilter: 'All',
  mastery: ['None', 'Arcane', 'Blast', 'Bomb', 'Chaos', 'Earth', 'Electric', 'Fire', 'Holy', 'Ice', 'Nature', 'Projectile', 'Shadow', 'Slam', 'Swing', 'Thrust'],
  masteryFilter: 'None',
  changeMasteryFilter (val)  {
    this.masteryFilter = val;
  },
  changeFilter (val)  {
    this.filter = val;
  },
  changeTitanFilter (val) {
    this.titanFilter = val;
  },
  changeMode (val)  {
    this.reset();
    if (this.runes['SingularFocus'] === true) this.runes['SingularFocus'] = false;
    this.mode = val;
  },
  showIcons (val)  {
    this.icons[val] = !this.icons[val];
  },
  runeSwitch (val) {
    this.runes[val] = !this.runes[val];
    switch (val) {
      case 'ImprovedRepetory': this.runes['ImprovedRepetory'] ? this.limit += 1 : this.limit -= 1; break;
      case 'FocusedMind': this.runes['FocusedMind'] ? this.limit -= 2 : this.limit += 2; break;
      case 'DevastatingBlow': this.runes['DevastatingBlow'] ? this.limit -= 3 : this.limit += 3; break;
      case 'Generalist': if (this.runes['Generalist']) this.generalist(1, 4); break;
      case 'Synchrony': if (this.runes['Synchrony']) this.synchrony(1, 4); break;
      default: break;
    }
  },
  generalist (stage, stageEnd)  {
    if (stage !== 5 && this.runes['Generalist']) {
      for (let i = stage; i <= stageEnd; i++) {
        let typesPool = [];
        this.pool.forEach((e) =>  {
          if (e.stage === i) typesPool = [...new Set(typesPool.concat(e.allTypes))];
        })
        this.generalistCount[i-1] = typesPool.length*1.5;
      }
    }
  },
  synchrony (stage, stageEnd)  {
    if (stage !== 5 && this.runes['Synchrony'])  {
      for (let i = stage; i <= stageEnd; i++) {
        this.synchronyCount[i-1] = 0;
        let result = {};
        this.pool.forEach((e) => {
          if (e.stage === i) {
            e.allTypes.forEach((a) => result[a] = result[a] + 1 || 1);
          }
        });
        for (let val in result) {
          if (result[val] >= 2) this.synchronyCount[i-1] += (result[val]-1)*0.7;
        }
        if (this.synchronyCount[i-1] > 20) this.synchronyCount[i-1] = 20;
      }
    }
  },
  add (name) {
    if (this.pool.every((e) => e.name !== name.name) || this.runes['SingularFocus']) {
      let stageLimit = 1;
      if (store.mode === "cathedral") stageLimit = 4;
      for (let i = 1; i <= stageLimit; i++)  {
        if (this.pool.filter((e) => e.stage === i).length < this.limit) {
          if (!this.runes["SingularFocus"] || this.pool.filter((e) => e.name === name.name && e.stage !== i).length < 1) {
            this.pool.push({...name, stage: i});
            allSkills.get(name.name).opacity = 0.2;
            if (this.runes['Generalist']) this.generalist(i, i);
            if (this.runes['Synchrony']) this.synchrony(i, i);
            break;
          } 
        }
      }
    }
  },
  delete (name, stage)  {
    this.pool = this.pool.filter((e) => e.name !== name);
    allSkills.get(name).opacity = 1;
    if (this.runes['Generalist']) this.generalist(stage, stage);
    if (this.runes['Synchrony']) this.synchrony(stage, stage);
  },
  banish (name) {
    if (this.pool.filter((e) => e.stage === 5).length < 10 && this.pool.every(e => e.name !== name.name) && store.mode === "cathedral")  {
      this.pool.push({...name, stage: 5});
      allSkills.get(name.name).opacity = 0.2;
    }
  },
  reset ()  {
    this.pool = [];
    this.generalistCount = this.synchronyCount = [0, 0, 0, 0];
    allSkills.forEach((e) => e.opacity = 1);
  },

});
/* END MobX BLOCK */ 

/* START COMPONENTS BLOCK */
function Skills ({arr}) {
  if (arr === "mastery") {
    arr = [];
    for (let [, value] of allSkills) {
      if (value.types.includes(store.masteryFilter)) arr.push(value.name);
    }
  }
  return  (
    arr.map((e, idx) => {
      const getSkill = allSkills.get(e);
      return (
        <div key={idx} style={{textAlign: "center", marginRight: "10px", marginBottom: "15px", opacity: allSkills.get(e).opacity}}>
          <Tooltip placement="top" title={<span className="tooltipInfo">{getSkill.name}</span>} followCursor>
            <Button variant="text" size="medium" className='allImgs'
            style={{backgroundImage: `url('/img/skills/${getSkill.name.replaceAll(' ', '')}.webp')`, backgroundSize: "cover", height:"65px"}}
            onClick={() => store.add(getSkill)}
            onContextMenu={() => store.banish(getSkill)}>
            {store.icons['types'] &&
            <div style={{position: "absolute", right: "-15%", top: "-15%"}}>
              {getSkill.types.map((b, ix) => {
                return <img key={ix} width="25px" height="25px" src={`img/types/${b}.png`} title={b} alt="no" />
              })}
            </div>}
            </Button>
          </Tooltip>
          {(store.icons['debuffs'] && getSkill.hasOwnProperty('debuffs')) &&
          <div className='buffDiv'>
            {getSkill.debuffs.map((b, ix) => {
              return <img key={ix} width="60px" height="60px" src={`/img/debuffs/${b}.png`} title={b} alt="no"/>
            })}
          </div>}
          {(store.icons['buffs'] && getSkill.hasOwnProperty('buffs')) &&
          <div className='buffDiv'>
            {getSkill.buffs.map((b, ix) => {
              return <img key={ix} width="60px" height="60px" src={`/img/buffs/${b}.png`} title={b} alt="no"/>
            })}
          </div>}
          {(store.icons['traits'] && getSkill.hasOwnProperty('traits')) &&
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

function TitanSkills ({arr}) {
  return (
    arr.map((i, idx) => {
      const getTitanSkill = titanSkills.get(i);
      return (
        <div key={idx} style={{textAlign: "center", marginRight: "30px", marginBottom: "15px"}}>
            <Tooltip placement="top" title={<span className="tooltipInfo">{i}<br />{getTitanSkill.condition && "Condition: " + getTitanSkill.condition}</span>} followCursor>
              <img style={{borderRadius: "60px", outline: getTitanSkill.condition && "2px solid red"}} width="80px" height="80px" src={`/img/titanSkills/${i.replaceAll(' ', '')}.webp`} alt="no"/>
            </Tooltip>
            <div>
            {getTitanSkill.debuffs && 
              getTitanSkill.debuffs.map((b, ix) => {
                return <img key={ix} width="30px" height="30px" src={`/img/debuffs/${b}.png`} title={b} alt="no"/>
              })}
            {getTitanSkill.traits && 
              getTitanSkill.traits.map((b, ix) => {
                return <img key={ix} width="30px" height="30px" src={`/img/traits/${b}.png`} title={b} alt="no"/>
              })}
            {getTitanSkill.buffs && 
              getTitanSkill.buffs.map((b, ix) => {
                return <img key={ix} width="30px" height="30px" src={`/img/buffs/${b}.png`} title={b} alt="no"/>
              })}
            {getTitanSkill.text}
          </div>
        </div>
      )
    })
  )
}

function Stage ({num}) {
  return (
    <>
      {(num !== 5 && store.mode === "cathedral") && <>
          <div className='title'>{'Stage ' + num} ({store.pool.filter((e) => e.stage === num).length} / {store.limit})</div>
          {store.runes['DevastatingBlow'] && <div style={{color: "orange", textAlign: "center", fontSize: "15pt"}}>All skills have Devastating</div>}
          <div style={{display: "flex", justifyContent: "center", fontSize: "15pt", marginBottom: "5px"}}>
            {store.runes['Generalist'] && <div style={{color: "yellow", marginRight: "10px"}}>+ {store.generalistCount[num-1]}% dmg</div>}
            {store.runes['Synchrony'] && <div style={{color: "aqua"}}>+ {store.synchronyCount[num-1].toFixed(1)}% dmg</div>}
          </div>
        </>}
      {num === 5 && <div className='title'>Banished ({store.pool.filter((e) => e.stage === 5).length} / 10)</div>}
      {store.mode === "void" && 
        <>
          <div className='title'>Build ({store.pool.filter((e) => e.stage === num).length} / {store.limit})</div>
          {store.runes['SingularFocus'] && <div style={{color: "pink", textAlign: "center", fontSize: "15pt", margin: "2px"}}>Multipicking!</div>}
          {store.runes['DevastatingBlow'] && <div style={{color: "orange", textAlign: "center", fontSize: "15pt", margin: "2px"}}>All skills have Devastating</div>}
          {store.runes['ImprovedRepetory'] && <div style={{color: "red", textAlign: "center", fontSize: "15pt", margin: "2px"}}>Improved Repetory: -15% damage</div>}
          {store.runes['FocusedMind'] && <div style={{color: "lime", textAlign: "center", fontSize: "15pt", margin: "2px"}}>Focused Mind: +70% damage</div>}
          {store.runes['Generalist'] && <div style={{color: "yellow", textAlign: "center", fontSize: "15pt", margin: "2px"}}>Generalist: + {store.generalistCount[num-1]}% dmg</div>}
          {store.runes['Synchrony'] && <div style={{color: "aqua", textAlign: "center", fontSize: "15pt", margin: "2px"}}>Synchrony: + {store.synchronyCount[num-1].toFixed(1)}% dmg</div>}
        </>}
      <div className='stages'>
        {store.pool.filter((e) => e.stage === num).map((i, idx) => {
          return  (
            <div key={idx} style={{textAlign: "center", marginRight: "5px", marginBottom: "2px", marginTop: "3px"}}>
              <Tooltip placement="top" title={<span className="tooltipInfo">{i.name}</span>} followCursor>
                <Button variant="text" size="medium" className='allImgs'
                style={{backgroundImage: `url('/img/skills/${i.name.replaceAll(' ', '')}.webp')`, backgroundSize: "cover", height:"65px"}}
                onClick={() => store.delete(i.name, num)}>
                {store.icons['types'] &&
                <div style={{position: "absolute", right: "-8%", top: "-15%"}}>
                  {i.types.map((b, ix) => {
                    return <img key={ix} width="25px" height="25px" src={`img/types/${b}.png`} title={b} alt="no" />
                  })}
                </div>}
                </Button>
              </Tooltip>
              {(store.icons['debuffs'] && i.hasOwnProperty('debuffs')) &&
              <div className='buffDiv'>
                {i.debuffs.map((b, ix) => {
                  return <img key={ix} width="60px" height="60px" src={`/img/debuffs/${b}.png`} title={b} alt="no"/>
                })}          
              </div>}
              {(store.icons['buffs'] && i.hasOwnProperty('buffs')) &&
              <div className='buffDiv'>
                {i.buffs.map((b, ix) => {
                  return <img key={ix} width="60px" height="60px" src={`/img/buffs/${b}.png`} title={b} alt="no"/>
                })}          
              </div>}
              {(store.icons['traits'] && i.hasOwnProperty('traits')) &&
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

function Rune ({name, check})  {
  return (
    <Tooltip placement="top" title={<span className="tooltipInfo">{name}</span>} followCursor>
      <label className='runeLabel'>
        <input type="checkbox" checked={check} onChange={() => store.runeSwitch(name.replaceAll(' ', ''))} />
        <img src={`/img/runes/${name.replaceAll(' ', '')}.png`} alt="no" />
      </label>
    </Tooltip>
  )
}

function Icons ({name, check})  {
  return (
    <label className='iconsLabel'>
      <input type="checkbox" checked={check} onChange={() => store.showIcons(name)} />
      <span>{name.charAt(0).toUpperCase() + name.slice(1)}</span>
    </label>
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

  const titansList = Array.from(titans.keys()).map((i, idx) => {
    return (
      <div key={idx} style={{margin: "10px"}}>
        <Tooltip placement="top" title={<span className="tooltipInfo">{i}</span>} followCursor>
          <label className="heroes">
            <input type='radio' name='titanFilter' value={i} onChange={(e) => store.changeTitanFilter(e.target.value)} />
            <img className='allImgs' src={`/img/titans/${i}.webp`} alt="no"/>
          </label>
        </Tooltip>
      </div>
    );
  });

  return (
    <>
    <div style={{position: 'absolute', fontSize: '10pt'}}>EA 1.0</div>
    <div className="mainTitle" align="center">Soulstone Survivors The Unholy Cathedral / Void Fields Build Planner by Solxnx</div>
      <div className="parent">
        <div className='left'>
          <div className='cList'>{charactersList}</div>
          {(store.filter !== "All") && 
          <>
            <div className='rList'>
              <Rune name={'Improved Repetory'} check={store.runes['ImprovedRepetory']} />
              <Rune name={'Focused Mind'} check={store.runes['FocusedMind']} />
              <Rune name={'Generalist'} check={store.runes['Generalist']} />
              <Rune name={'Synchrony'} check={store.runes['Synchrony']} />
              {store.mode === "void" && <Rune name={'Singular Focus'} check={store.runes['SingularFocus']} />}
              <Rune name={'Devastating Blow'} check={store.runes['DevastatingBlow']} />
            </div>
            <div style={{textAlign: "center", marginTop: "15px"}}>
              <div style={{fontSize: "15pt", marginBottom: "10px"}}>Skill Mastery
                <select className="masteryBlock" name="mastery" onChange={(e) => store.changeMasteryFilter(e.target.value)}>
                  {store.mastery.map((i, idx) => {
                    return <option key={idx} value={i}>{i}</option>
                  })}
                </select>
              </div>
            </div>
          </>}
          <div align="center" className='title' style={{marginTop: "20px"}}>Titans</div>
          <div className='tList'>{titansList}</div>
        </div>
        <div className='center'>
          {(store.filter !== "All") && 
            <>
              <div className='stack'>
                <Icons name={'debuffs'} check={store.icons['debuffs']} />
                <Icons name={'buffs'} check={store.icons['buffs']} />
                <Icons name={'traits'} check={store.icons['traits']} />
                <Icons name={'types'} check={store.icons['types']} />
              </div>
              <div className="items"><Skills arr={allHeroes.get(store.filter).wArray} /></div>
              <div className="items"><Skills arr={allHeroes.get(store.filter).sArray} /></div>
              {(store.masteryFilter !== "None") && <div className="items"><Skills arr={"mastery"} /></div>}
            </>}
          {(store.filter === "All") && <div style={{fontSize: "35px", textAlign: "center", marginBottom: "50px"}}>Choose your character</div>}
          {(store.titanFilter !== "All") &&  <div className="items"><TitanSkills arr={titans.get(store.titanFilter).skills} /></div>}
        </div>
        <div className='right'>
        <div className='stack'>
            <label className='iconsLabel'>
              <input name='mode' type="radio" value="cathedral" checked={store.mode === "cathedral" ? true : false} onChange={(e) => store.changeMode(e.target.value)} /><span>Unholy Cathedral</span>
            </label>
            <label className='iconsLabel'>
              <input name='mode' type="radio" value="void" checked={store.mode === "void" ? true : false} onChange={(e) => store.changeMode(e.target.value)} /><span>Void Fields</span>
            </label>
          </div>
          {store.mode === "cathedral" 
          ? <>
              <Stage num={1} />
              <Stage num={2} />
              <Stage num={3} />
              <Stage num={4} />
              <Stage num={5} />
            </>
          : <><Stage num={1} /></>}
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