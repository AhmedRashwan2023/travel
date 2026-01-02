function getTravelData(searchValue = '') {
  return fetch('./travel_recommendation_api.json')
    .then((res) => {
      if (!res.ok) throw new Error('Fetch failed');
      return res.json();
    })
    .then((data) => {
      const countries = data?.countries ?? [];
      const value = searchValue.toLowerCase().trim();

      if (!value) {
        return data;
      }

      const keywordMap = {
        temple: 'temples',
        temples: 'temples',
        tample: 'temples',
        tamplee: 'temples',
        beach: 'beaches',
        beaches: 'beaches',
      };

      if (keywordMap[value]) {
        return data[keywordMap[value]] ?? [];
      }

      return countries.filter(
        (country) =>
          country.name.toLowerCase().includes(value) ||
          country.cities.some(
            (city) =>
              city.name.toLowerCase().includes(value) ||
              city.description.toLowerCase().includes(value)
          )
      );
    })
    .catch((err) => {
      console.error(err);
      return [];
    });
}

function handleSearch() {
  const input = document.querySelector('input').value;

  getTravelData(input).then((result) => {
    if (result.length) {
      const search = document.querySelector('.hero-search-values');
      search.innerHTML = ``;
      result.forEach(
        (res) =>
          (search.innerHTML += `
      <div style="background-color: #fff; color: #000; width:350px; border-radius: 8px;">
        <img src="assets/${res.imageUrl}" class="search-image"/>
        <div style="padding: 10px 5px">
        <h4>${res.name}</h4>
        <p>${res.description}</p>
        </div>
      </div>
      `)
      );

      search.style.setProperty('visibility', 'visible');
    } else console.log('none');
  });
}

function clearSearch() {
  document.querySelector('input').value = '';
  document
    .querySelector('.hero-search-values')
    .style.setProperty('visibility', 'hidden');
}
