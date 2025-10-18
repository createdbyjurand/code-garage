import { expect } from 'jsr:@std/expect';
import {
  extractRelevantWords,
  findBestMatch,
  getBaseName,
  getMatchPercentage,
  hasExactMatch,
  isSameEpisodeInSeries,
  isSamePart,
  isValidMatch,
  MIN_MATCH_PERCENT,
} from './rename.deno.ts';

/// extractRelevantWords

Deno.test('extractRelevantWords', async t => {
  await t.step('should remove irrelevant words', () => {
    expect(extractRelevantWords('movie.2025.720p.bluray.mkv')).toEqual(['movie', '2025']);
    expect(extractRelevantWords('movie.2025.720.web.mkv')).toEqual(['movie', '2025']);
  });
});

/// getMatchPercentage

Deno.test('getMatchPercentage', async t => {
  await t.step('should be true', () => {
    const mocks = [
      { aWords: ['a', 'b', 'c'], bWords: ['a', 'b', 'c'], result: 100 },
      { aWords: [], bWords: [], result: 0 },
      { aWords: ['a'], bWords: ['b'], result: 0 },
      { aWords: ['a', 'b'], bWords: ['a', 'c'], result: 50 },
      { aWords: ['a', 'b', 'c'], bWords: ['a', 'b', 'd'], result: 67 },
      { aWords: ['a', 'b', 'c', 'd'], bWords: ['a', 'b', 'c'], result: 75 },
      {
        aWords: ['a', 'b', 'c'],
        bWords: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'],
        result: 33,
      },
      {
        aWords: ['a', 'b', 'c', 'd'],
        bWords: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'],
        result: 44,
      },
      {
        aWords: ['a', 'b', 'c', 'd'],
        bWords: ['a', 'b', 'c', 'e', 'f', 'g', 'h', 'i'],
        result: 38,
      },
    ];

    mocks.forEach(mock => {
      // console.log('[RESULT] percent:', getMatchPercentage(mock.aWords, mock.bWords));
      expect(getMatchPercentage(mock.aWords, mock.bWords)).toBe(mock.result);
    });
  });
});

/// getBaseName

Deno.test('getBaseName', async t => {
  await t.step('should remove extension', () => {
    expect(getBaseName('movie.2025.720p.bluray.mkv', ['srt', 'mkv'])).toBe(
      'movie.2025.720p.bluray',
    );
  });

  await t.step('should not remove extension', () => {
    expect(getBaseName('movie.2025.720p.bluray.avi', ['srt', 'mkv'])).toBe(
      'movie.2025.720p.bluray.avi',
    );

    expect(getBaseName('Movie.2025.720p.bluray', ['srt', 'mkv'])).toBe('Movie.2025.720p.bluray');
  });
});

/// hasExactMatch

Deno.test('hasExactMatch', async t => {
  await t.step('should be true', () => {
    expect(
      hasExactMatch(
        'ANOTHER_WORLD_PART_ONE.1080P.MKV',
        ['another_world_part_one.1080p.srt'],
        ['mkv', 'srt'],
      ),
    ).toBe(true);
  });

  await t.step('should be false', () => {
    expect(hasExactMatch('movie_name.1080p.mkv', ['movie-name.1080p.mkv'], ['mkv', 'srt'])).toBe(
      false,
    );
  });
});

/// isSameEpisodeInSeries

Deno.test('isSameEpisodeInSeries', async t => {
  await t.step('should be true', () => {
    expect(
      isSameEpisodeInSeries(
        'Bla.Bla.Car.S01e01.1920.720p.bluray.mkv',
        'Some.Other.Series.s01E01.2021.1080p.web.srt',
      ),
    ).toBe(true);
    expect(
      isSameEpisodeInSeries(
        'Bla.Bla.Car.1920.720p.bluray.mkv',
        'Some.Other.Series.2021.1080p.web.srt',
      ),
    ).toBe(true);
  });

  await t.step('should be false', () => {
    expect(
      isSameEpisodeInSeries(
        'another_World_part_one.s01e01.1080p.mkv',
        'mountain-Warehouse-part-two.s01e02.720p.srt',
      ),
    ).toBe(false);
    expect(
      isSameEpisodeInSeries(
        'another_World_part_one.s02e01.1080p.mkv',
        'mountain-Warehouse-part-two.s01e01.720p.srt',
      ),
    ).toBe(false);
    expect(
      isSameEpisodeInSeries(
        'another_World_part_one.s01e01.1080p.mkv',
        'mountain-Warehouse-part-two.720p.srt',
      ),
    ).toBe(false);
    expect(
      isSameEpisodeInSeries(
        'another_World_part_one.1080p.mkv',
        'mountain-Warehouse-part-two.s01e02.720p.srt',
      ),
    ).toBe(false);
  });
});

/// isSamePart

Deno.test('isSamePart', async t => {
  await t.step('should be true', () => {
    expect(
      isSamePart(
        'Bla.Bla.Car.S01e01.1920.720p.-part-one.mkv',
        'Some.Other.Series_part.one.s01E01.2021.1080p.web.srt',
      ),
    ).toBe(true);

    expect(
      isSamePart(
        'Bla.Bla.Car.cd-x.S01e01.1920.720p.mkv',
        'Some.Other.Series_cd.x.s01E01.2021.1080p.web.srt',
      ),
    ).toBe(true);

    expect(isSamePart('Bla.Bla.Car.1920.720p.mkv', 'Some.Other.Series.2021.1080p.web.srt')).toBe(
      true,
    );
  });

  await t.step('should be false', () => {
    expect(
      isSamePart(
        'another_World_part_one.s01e01.1080p.mkv',
        'mountain-Warehouse-part-two.s01e02.720p.srt',
      ),
    ).toBe(false);

    expect(
      isSamePart(
        'another_World_part_one.s01e01.1080p.mkv',
        'mountain-Warehouse-pt-one.s01e02.720p.srt',
      ),
    ).toBe(false);

    expect(
      isSamePart(
        'another_World_disk_III.s01e01.1080p.mkv',
        'mountain-Warehouse-disk-IV.s01e02.720p.srt',
      ),
    ).toBe(false);

    expect(
      isSamePart('another_World.1080p.mkv', 'mountain-Warehouse-disk-IV.s01e02.720p.srt'),
    ).toBe(false);

    expect(isSamePart('mountain-Warehouse-part_3.s01e02.720p.avi', 'another_World.1080p.txt')).toBe(
      false,
    );
  });
});

/// isValidMatch

Deno.test('isValidMatch', async t => {
  await t.step('mocks array', () => {
    const mocks = [
      {
        reference: '',
        candidate: '',
        percent: 70,
        threshold: 70,
        result: true,
      },
      {
        reference: 'a',
        candidate: 'b',
        percent: 70,
        threshold: 70,
        result: true,
      },
      {
        reference: 'a',
        candidate: 'b',
        percent: 69,
        threshold: 70,
        result: false,
      },
      {
        reference: 'a',
        candidate: 'b',
        percent: 71,
        threshold: 70,
        result: true,
      },
      {
        reference: 'a.part.1.asd',
        candidate: 'b.part.1.dsa',
        percent: 71,
        threshold: 70,
        result: true,
      },
      {
        reference: 'a.part.1.srt',
        candidate: 'b.part.2.mkv',
        percent: 71,
        threshold: 70,
        result: false,
      },
      {
        reference: 'a-s00e00-c.srt',
        candidate: 'b-s00e00-e.mkv',
        percent: 71,
        threshold: 70,
        result: true,
      },
      {
        reference: 'a-s01e01-c.srt',
        candidate: 'b-s02e02-e.mkv',
        percent: 71,
        threshold: 70,
        result: false,
      },
    ];
    console.log();
    mocks.forEach(mock =>
      expect(isValidMatch(mock.reference, mock.candidate, mock.percent, mock.threshold)).toBe(
        mock.result,
      ),
    );
  });
});

/// findBestMatch

Deno.test('findBestMatch', async t => {
  await t.step('should return the best match when there is a clear winner', () => {
    const reference = 'The.Matrix.1999.1080p.BluRay.x264.srt';
    const candidates = [
      'The.Matrix.1999.1080p.BluRay.x264.mkv',
      'The.Matrix.Reloaded.2003.1080p.BluRay.x264.mkv',
      'Some.Other.Movie.2020.1080p.web.mkv',
    ];

    const result = findBestMatch(reference, candidates, 70);

    expect(result).not.toBeNull();
    expect(result?.result).toBe('The.Matrix.1999.1080p.BluRay.x264.mkv');
    expect(result?.percent).toBeGreaterThan(70);
  });

  await t.step('should return null when no matches exceed threshold', () => {
    const reference = 'The.Matrix.1999.srt';
    const candidates = ['Completely.Different.Movie.2020.mkv', 'Another.Unrelated.Film.2021.mkv'];

    const result = findBestMatch(reference, candidates, 70);

    expect(result).toBeNull();
  });

  await t.step('should return null when there is a tie between top matches', () => {
    const reference = 'Movie.Name.srt';
    const candidates = ['Movie.Name.1080p.mkv', 'Movie.Name.720p.mkv'];

    const result = findBestMatch(reference, candidates, 70);

    expect(result).toBeNull();
  });

  await t.step('should ignore video quality tags and codec info', () => {
    const reference = 'Breaking.Bad.S01E01.srt';
    const candidates = [
      'Breaking.Bad.S01E01.1080p.BluRay.x264.mkv',
      'Breaking.Bad.S01E01.720p.web.x265.mkv',
    ];

    const result = findBestMatch(reference, candidates, 70);

    expect(result).toBeNull();
  });

  await t.step('should handle episode numbering correctly', () => {
    const reference = 'Show.Name.S02E05.srt';
    const candidates = ['Show.Name.S02E04.mkv', 'Show.Name.S02E05.mkv', 'Show.Name.S02E06.mkv'];

    const result = findBestMatch(reference, candidates, 70);

    expect(result).not.toBeNull();
    expect(result?.result).toBe('Show.Name.S02E05.mkv');
    expect(result?.percent).toBe(100);
  });

  await t.step('should return null for empty candidates array', () => {
    const reference = 'Movie.Name.srt';
    const candidates: string[] = [];

    const result = findBestMatch(reference, candidates, 70);

    expect(result).toBeNull();
  });

  await t.step('should handle different thresholds correctly', () => {
    const reference = 'Movie.Name.2020.srt';
    const candidates = ['Movie.Name.2020.1080p.mkv', 'Movie.2020.720p.mkv'];

    const resultHigh = findBestMatch(reference, candidates, 90);
    const resultLow = findBestMatch(reference, candidates, 50);

    expect(resultHigh).not.toBeNull();
    expect(resultLow).not.toBeNull();
    expect(resultHigh?.result).toBe('Movie.Name.2020.1080p.mkv');
  });

  await t.step('should match partial names when threshold allows', () => {
    const reference = 'Inception.srt';
    const candidates = ['Inception.2010.1080p.BluRay.mkv', 'Interstellar.2014.1080p.BluRay.mkv'];

    const result = findBestMatch(reference, candidates, 50);

    expect(result).not.toBeNull();
    expect(result?.result).toBe('Inception.2010.1080p.BluRay.mkv');
  });

  await t.step('should handle part in filenames', () => {
    const reference = 'Movie-Name_Part.1.srt';
    const candidates = ['Movie-Name_Part.1.1080p.mkv', 'Movie-Name_Part.2.1080p.mkv'];

    const result = findBestMatch(reference, candidates, MIN_MATCH_PERCENT);

    // console.log('[RESULT]', { reference, candidates, result });

    expect(result).not.toBeNull();
    expect(result?.result).toBe('Movie-Name_Part.1.1080p.mkv');
  });
});
