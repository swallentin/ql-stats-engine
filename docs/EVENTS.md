# Game Event Types

## PLAYER_CONNECT
## PLAYER_DISCONNECT
## PLAYER_SWITCHTEAM 
## MATCH_STARTED
### Duel
```
{
	"DATA" : {
		"CAPTURE_LIMIT" : 8,
		"FACTORY" : "duel",
		"FACTORY_TITLE" : "Duel",
		"FRAG_LIMIT" : 0,
		"GAME_TYPE" : "DUEL",
		"INFECTED" : 0,
		"INSTAGIB" : 0,
		"MAP" : "furiousheights",
		"MATCH_GUID" : "8eb56455-2dad-4346-babb-1246180fc98a",
		"MERCY_LIMIT" : 0,
		"PLAYERS" : [
			{
				"NAME" : "Rawbat",
				"STEAM_ID" : "76561197993085337",
				"TEAM" : 0
			},
			{
				"NAME" : "Jihker",
				"STEAM_ID" : "76561198038951702",
				"TEAM" : 0
			}
		],
		"QUADHOG" : 0,
		"SCORE_LIMIT" : 150,
		"SERVER_TITLE" : ".se Arte et Marte  #1",
		"TIME_LIMIT" : 10,
		"TRAINING" : 0
	},
	"TYPE" : "MATCH_STARTED",
	"SERVER" : {
		"name" : "ql-sth-01 #1",
		"hostname" : "5.150.254.201",
		"port" : 27960,
		"password" : ""
	},
	"EVENT_TIME" : ISODate("2015-11-03T21:38:09.107Z"),
	"_id" : ObjectId("5639294115cda41604110d07")
}
```
## PLAYER_STATS
### Duel 
The player with the highest rank is the winning player.
*Winning player*
```
{
	"DATA" : {
		"ABORTED" : false,
		"DAMAGE" : {
			"DEALT" : 4743,
			"TAKEN" : 3409
		},
		"DEATHS" : 5,
		"ITEM_TIMING" : {
			"MEGA_HEALTH" : 3083,
			"RED_ARMOR" : 9190,
			"YELLOW_ARMOR" : 13847
		},
		"KILLS" : 19,
		"LOSE" : 0,
		"MATCH_GUID" : "a1d37c02-cb53-48f0-8530-79bde28f49ae",
		"MAX_STREAK" : 13,
		"MEDALS" : {
			"ACCURACY" : 0,
			"ASSISTS" : 0,
			"CAPTURES" : 0,
			"COMBOKILL" : 2,
			"DEFENDS" : 0,
			"EXCELLENT" : 0,
			"FIRSTFRAG" : 1,
			"HEADSHOT" : 0,
			"HUMILIATION" : 0,
			"IMPRESSIVE" : 3,
			"MIDAIR" : 0,
			"PERFECT" : 0,
			"PERFORATED" : 0,
			"QUADGOD" : 0,
			"RAMPAGE" : 0,
			"REVENGE" : 0
		},
		"MODEL" : "doom",
		"NAME" : "horowitz",
		"PICKUPS" : {
			"AMMO" : 4,
			"ARMOR" : 24,
			"ARMOR_REGEN" : 0,
			"BATTLESUIT" : 0,
			"DOUBLER" : 0,
			"FLIGHT" : 0,
			"GREEN_ARMOR" : 0,
			"GUARD" : 0,
			"HASTE" : 0,
			"HEALTH" : 40,
			"INVIS" : 0,
			"INVULNERABILITY" : 0,
			"KAMIKAZE" : 0,
			"MEDKIT" : 0,
			"MEGA_HEALTH" : 9,
			"OTHER_HOLDABLE" : 0,
			"OTHER_POWERUP" : 0,
			"PORTAL" : 0,
			"QUAD" : 0,
			"RED_ARMOR" : 10,
			"REGEN" : 0,
			"SCOUT" : 0,
			"TELEPORTER" : 0,
			"YELLOW_ARMOR" : 18
		},
		"PLAY_TIME" : 662,
		"QUIT" : 0,
		"RANK" : 1,
		"SCORE" : 19,
		"STEAM_ID" : "76561198256572993",
		"TIED_RANK" : 0,
		"WARMUP" : false,
		"WEAPONS" : {
			"BFG" : {
				"D" : 0,
				"DG" : 0,
				"DR" : 0,
				"H" : 0,
				"K" : 0,
				"P" : 0,
				"S" : 0,
				"T" : 0
			},
			"CHAINGUN" : {
				"D" : 0,
				"DG" : 0,
				"DR" : 0,
				"H" : 0,
				"K" : 0,
				"P" : 0,
				"S" : 0,
				"T" : 0
			},
			"GAUNTLET" : {
				"D" : 1,
				"DG" : 50,
				"DR" : 38,
				"H" : 0,
				"K" : 0,
				"P" : 0,
				"S" : 0,
				"T" : 10
			},
			"GRENADE" : {
				"D" : 1,
				"DG" : 0,
				"DR" : 64,
				"H" : 0,
				"K" : 0,
				"P" : 4,
				"S" : 0,
				"T" : 0
			},
			"HMG" : {
				"D" : 0,
				"DG" : 0,
				"DR" : 0,
				"H" : 0,
				"K" : 0,
				"P" : 0,
				"S" : 0,
				"T" : 0
			},
			"LIGHTNING" : {
				"D" : 0,
				"DG" : 852,
				"DR" : 504,
				"H" : 142,
				"K" : 3,
				"P" : 8,
				"S" : 551,
				"T" : 46
			},
			"MACHINEGUN" : {
				"D" : 0,
				"DG" : 10,
				"DR" : 140,
				"H" : 2,
				"K" : 0,
				"P" : 0,
				"S" : 34,
				"T" : 121
			},
			"NAILGUN" : {
				"D" : 0,
				"DG" : 0,
				"DR" : 0,
				"H" : 0,
				"K" : 0,
				"P" : 0,
				"S" : 0,
				"T" : 0
			},
			"OTHER_WEAPON" : {
				"D" : 0,
				"DG" : 0,
				"DR" : 0,
				"H" : 0,
				"K" : 0,
				"P" : 0,
				"S" : 0,
				"T" : 0
			},
			"PLASMA" : {
				"D" : 0,
				"DG" : 0,
				"DR" : 0,
				"H" : 0,
				"K" : 0,
				"P" : 0,
				"S" : 0,
				"T" : 0
			},
			"PROXMINE" : {
				"D" : 0,
				"DG" : 0,
				"DR" : 0,
				"H" : 0,
				"K" : 0,
				"P" : 0,
				"S" : 0,
				"T" : 0
			},
			"RAILGUN" : {
				"D" : 2,
				"DG" : 1440,
				"DR" : 1080,
				"H" : 18,
				"K" : 8,
				"P" : 7,
				"S" : 53,
				"T" : 144
			},
			"ROCKET" : {
				"D" : 1,
				"DG" : 2351,
				"DR" : 1358,
				"H" : 47,
				"K" : 7,
				"P" : 14,
				"S" : 84,
				"T" : 335
			},
			"SHOTGUN" : {
				"D" : 0,
				"DG" : 40,
				"DR" : 25,
				"H" : 8,
				"K" : 1,
				"P" : 4,
				"S" : 20,
				"T" : 3
			}
		},
		"WIN" : 1
	},
	"TYPE" : "PLAYER_STATS",
	"SERVER" : {
		"name" : "ql-fr-01 #2",
		"hostname" : "46.101.227.252",
		"port" : 27961,
		"password" : ""
	}
}
```
*Losing player*
```
{
	"DATA" : {
		"ABORTED" : false,
		"DAMAGE" : {
			"DEALT" : 3312,
			"TAKEN" : 4235
		},
		"DEATHS" : 20,
		"ITEM_TIMING" : {
			"MEGA_HEALTH" : 3921,
			"RED_ARMOR" : 5252,
			"YELLOW_ARMOR" : 10296
		},
		"KILLS" : 5,
		"LOSE" : 1,
		"MATCH_GUID" : "a1d37c02-cb53-48f0-8530-79bde28f49ae",
		"MAX_STREAK" : 1,
		"MEDALS" : {
			"ACCURACY" : 0,
			"ASSISTS" : 0,
			"CAPTURES" : 0,
			"COMBOKILL" : 1,
			"DEFENDS" : 0,
			"EXCELLENT" : 0,
			"FIRSTFRAG" : 0,
			"HEADSHOT" : 0,
			"HUMILIATION" : 1,
			"IMPRESSIVE" : 1,
			"MIDAIR" : 0,
			"PERFECT" : 0,
			"PERFORATED" : 0,
			"QUADGOD" : 0,
			"RAMPAGE" : 0,
			"REVENGE" : 2
		},
		"MODEL" : "doom/sport_blue",
		"NAME" : "xi^4nnn^7",
		"PICKUPS" : {
			"AMMO" : 6,
			"ARMOR" : 20,
			"ARMOR_REGEN" : 0,
			"BATTLESUIT" : 0,
			"DOUBLER" : 0,
			"FLIGHT" : 0,
			"GREEN_ARMOR" : 0,
			"GUARD" : 0,
			"HASTE" : 0,
			"HEALTH" : 14,
			"INVIS" : 0,
			"INVULNERABILITY" : 0,
			"KAMIKAZE" : 0,
			"MEDKIT" : 0,
			"MEGA_HEALTH" : 7,
			"OTHER_HOLDABLE" : 0,
			"OTHER_POWERUP" : 0,
			"PORTAL" : 0,
			"QUAD" : 0,
			"RED_ARMOR" : 9,
			"REGEN" : 0,
			"SCOUT" : 0,
			"TELEPORTER" : 0,
			"YELLOW_ARMOR" : 13
		},
		"PLAY_TIME" : 662,
		"QUIT" : 0,
		"RANK" : 2,
		"SCORE" : 4,
		"STEAM_ID" : "76561198059489229",
		"TIED_RANK" : 0,
		"WARMUP" : false,
		"WEAPONS" : {
			"BFG" : {
				"D" : 0,
				"DG" : 0,
				"DR" : 0,
				"H" : 0,
				"K" : 0,
				"P" : 0,
				"S" : 0,
				"T" : 0
			},
			"CHAINGUN" : {
				"D" : 0,
				"DG" : 0,
				"DR" : 0,
				"H" : 0,
				"K" : 0,
				"P" : 0,
				"S" : 0,
				"T" : 0
			},
			"GAUNTLET" : {
				"D" : 0,
				"DG" : 50,
				"DR" : 50,
				"H" : 0,
				"K" : 1,
				"P" : 0,
				"S" : 0,
				"T" : 9
			},
			"GRENADE" : {
				"D" : 0,
				"DG" : 100,
				"DR" : 0,
				"H" : 1,
				"K" : 1,
				"P" : 6,
				"S" : 3,
				"T" : 7
			},
			"HMG" : {
				"D" : 0,
				"DG" : 0,
				"DR" : 0,
				"H" : 0,
				"K" : 0,
				"P" : 0,
				"S" : 0,
				"T" : 0
			},
			"LIGHTNING" : {
				"D" : 3,
				"DG" : 504,
				"DR" : 849,
				"H" : 84,
				"K" : 0,
				"P" : 12,
				"S" : 301,
				"T" : 39
			},
			"MACHINEGUN" : {
				"D" : 0,
				"DG" : 140,
				"DR" : 10,
				"H" : 28,
				"K" : 0,
				"P" : 0,
				"S" : 85,
				"T" : 215
			},
			"NAILGUN" : {
				"D" : 0,
				"DG" : 0,
				"DR" : 0,
				"H" : 0,
				"K" : 0,
				"P" : 0,
				"S" : 0,
				"T" : 0
			},
			"OTHER_WEAPON" : {
				"D" : 0,
				"DG" : 0,
				"DR" : 0,
				"H" : 0,
				"K" : 0,
				"P" : 0,
				"S" : 0,
				"T" : 0
			},
			"PLASMA" : {
				"D" : 0,
				"DG" : 0,
				"DR" : 0,
				"H" : 0,
				"K" : 0,
				"P" : 1,
				"S" : 0,
				"T" : 0
			},
			"PROXMINE" : {
				"D" : 0,
				"DG" : 0,
				"DR" : 0,
				"H" : 0,
				"K" : 0,
				"P" : 0,
				"S" : 0,
				"T" : 0
			},
			"RAILGUN" : {
				"D" : 8,
				"DG" : 1120,
				"DR" : 1099,
				"H" : 14,
				"K" : 2,
				"P" : 16,
				"S" : 41,
				"T" : 94
			},
			"ROCKET" : {
				"D" : 8,
				"DG" : 1373,
				"DR" : 2022,
				"H" : 27,
				"K" : 1,
				"P" : 13,
				"S" : 65,
				"T" : 279
			},
			"SHOTGUN" : {
				"D" : 1,
				"DG" : 25,
				"DR" : 40,
				"H" : 5,
				"K" : 0,
				"P" : 8,
				"S" : 80,
				"T" : 16
			}
		},
		"WIN" : 0
	},
	"TYPE" : "PLAYER_STATS",
	"SERVER" : {
		"name" : "ql-fr-01 #2",
		"hostname" : "46.101.227.252",
		"port" : 27961,
		"password" : ""
	}
}
```

## MATCH_REPORT
### Duel
```
{
	"DATA" : {
		"ABORTED" : false,
		"CAPTURE_LIMIT" : 8,
		"EXIT_MSG" : "Timelimit hit.",
		"FACTORY" : "duel",
		"FACTORY_TITLE" : "Duel",
		"FIRST_SCORER" : "inl",
		"FRAG_LIMIT" : 0,
		"GAME_LENGTH" : 600,
		"GAME_TYPE" : "DUEL",
		"INFECTED" : 0,
		"INSTAGIB" : 0,
		"LAST_LEAD_CHANGE_TIME" : 200,
		"LAST_SCORER" : "auraDiiN",
		"LAST_TEAMSCORER" : "none",
		"MAP" : "cure",
		"MATCH_GUID" : "cb850666-d5e8-4310-b93b-1083fc26f658",
		"MERCY_LIMIT" : 0,
		"QUADHOG" : 0,
		"RESTARTED" : 0,
		"SCORE_LIMIT" : 150,
		"SERVER_TITLE" : ".se Arte et Marte  #1",
		"TIME_LIMIT" : 10,
		"TRAINING" : 0,
		"TSCORE0" : 0,
		"TSCORE1" : 0
	},
	"TYPE" : "MATCH_REPORT",
	"_id" : ObjectId("56354ee11726e1d63165f61b")
}
```
## PLAYER_DEATH
## PLAYER_KILL
## PLAYER_MEDAL
