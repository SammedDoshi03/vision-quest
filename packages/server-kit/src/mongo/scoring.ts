export interface ViewerVector {
  tagIds: string[];
  depths: number[];
  ancestors: string[];
  languages: string[];
  heritageRegionIds: string[];
  home: { type: 'Point'; coordinates: [number, number] };
  gender: string;
  prefs: {
    genders: string[];
    ageMin: number;
    ageMax: number;
    maxDistanceKm: number;
  };
  age: number;
  birthDateFloor: Date;
  birthDateCeil: Date;
  excludeIds: string[];
  minScore: number;
}

const W = {
  niche: 1.0,
  ancestor: 0.15,
  language: 0.6,
  heritage: 0.8,
  proximity: 1.2,
  recency: 0.8,
};

export function buildInterestScoringPipeline(me: ViewerVector): Record<string, unknown>[] {
  return [
    {
      $set: {
        _shared: {
          $filter: {
            input: '$interests',
            as: 'i',
            cond: { $in: ['$$i.tagId', me.tagIds] },
          },
        },
        _sharedAncestors: {
          $size: {
            $setIntersection: [
              {
                $reduce: {
                  input: '$interests.ancestors',
                  initialValue: [],
                  in: { $setUnion: ['$$value', '$$this'] },
                },
              },
              me.ancestors,
            ],
          },
        },
        _lang: { $size: { $setIntersection: ['$languages', me.languages] } },
        _heritage: { $size: { $setIntersection: ['$heritageRegionIds', me.heritageRegionIds] } },
        _hoursIdle: { $dateDiff: { startDate: '$lastActiveAt', endDate: '$$NOW', unit: 'hour' } },
      },
    },
    {
      $set: {
        _niche: {
          $reduce: {
            input: '$_shared',
            initialValue: 0,
            in: {
              $add: [
                '$$value',
                {
                  $multiply: [
                    '$$this.idf',
                    {
                      $min: [
                        '$$this.depth',
                        {
                          $arrayElemAt: [
                            me.depths,
                            { $indexOfArray: [me.tagIds, '$$this.tagId'] },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          },
        },
      },
    },
    {
      $set: {
        score: {
          $add: [
            { $multiply: ['$_niche', W.niche] },
            { $multiply: ['$_sharedAncestors', W.ancestor] },
            { $multiply: ['$_lang', W.language] },
            { $multiply: ['$_heritage', W.heritage] },
            {
              $multiply: [
                W.proximity,
                { $divide: [1, { $add: [1, { $divide: [{ $ifNull: ['$distanceM', 0] }, 5000] }] }] },
              ],
            },
            {
              $multiply: [
                W.recency,
                { $divide: [1, { $add: [1, { $divide: ['$_hoursIdle', 48] }] }] },
              ],
            },
          ],
        },
        sharedTagIds: '$_shared.tagId',
      },
    },
  ];
}
