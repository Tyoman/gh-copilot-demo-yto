import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../server';
import { resetAlbums } from '../routes/albums';

describe('Album API', () => {
  beforeEach(() => {
    // Reset albums to initial state before each test
    resetAlbums();
  });

  describe('GET /', () => {
    it('should return welcome message', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.text).toBe('Hit the /albums endpoint to retrieve a list of albums!');
    });
  });

  describe('GET /albums', () => {
    it('should return all 6 albums', async () => {
      const response = await request(app).get('/albums');
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(6);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('artist');
      expect(response.body[0]).toHaveProperty('price');
      expect(response.body[0]).toHaveProperty('image_url');
    });

    it('should return albums with correct data', async () => {
      const response = await request(app).get('/albums');
      const firstAlbum = response.body[0];
      expect(firstAlbum.id).toBe(1);
      expect(firstAlbum.title).toBe('You, Me and an App Id');
      expect(firstAlbum.artist).toBe('Daprize');
      expect(firstAlbum.price).toBe(10.99);
    });
  });

  describe('GET /albums/:id', () => {
    it('should return a specific album by id', async () => {
      const response = await request(app).get('/albums/1');
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
      expect(response.body.title).toBe('You, Me and an App Id');
    });

    it('should return 404 for non-existent album', async () => {
      const response = await request(app).get('/albums/999');
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Album not found');
    });
  });

  describe('POST /albums', () => {
    it('should create a new album', async () => {
      const newAlbum = {
        title: 'Test Album',
        artist: 'Test Artist',
        price: 15.99,
        image_url: 'https://example.com/image.jpg'
      };

      const response = await request(app)
        .post('/albums')
        .send(newAlbum);

      expect(response.status).toBe(201);
      expect(response.body.id).toBe(7); // Should be next ID after 6
      expect(response.body.title).toBe('Test Album');
      expect(response.body.artist).toBe('Test Artist');
      expect(response.body.price).toBe(15.99);

      // Verify it was added
      const getResponse = await request(app).get('/albums');
      expect(getResponse.body).toHaveLength(7);
    });

    it('should return 400 for missing required fields', async () => {
      const invalidAlbum = {
        title: 'Test Album'
        // Missing other required fields
      };

      const response = await request(app)
        .post('/albums')
        .send(invalidAlbum);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Missing required fields');
    });
  });

  describe('PUT /albums/:id', () => {
    it('should update an existing album', async () => {
      const updates = {
        title: 'Updated Title',
        price: 20.99
      };

      const response = await request(app)
        .put('/albums/1')
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
      expect(response.body.title).toBe('Updated Title');
      expect(response.body.price).toBe(20.99);
      expect(response.body.artist).toBe('Daprize'); // Should remain unchanged
    });

    it('should return 404 for non-existent album', async () => {
      const response = await request(app)
        .put('/albums/999')
        .send({ title: 'Test' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Album not found');
    });

    it('should update only provided fields', async () => {
      const updates = {
        price: 25.99
      };

      const response = await request(app)
        .put('/albums/2')
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body.price).toBe(25.99);
      expect(response.body.title).toBe('Seven Revision Army'); // Should remain unchanged
    });
  });

  describe('DELETE /albums/:id', () => {
    it('should delete an existing album', async () => {
      const response = await request(app).delete('/albums/1');

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);

      // Verify it was deleted
      const getResponse = await request(app).get('/albums');
      expect(getResponse.body).toHaveLength(5);

      // Verify it's really gone
      const getDeletedResponse = await request(app).get('/albums/1');
      expect(getDeletedResponse.status).toBe(404);
    });

    it('should return 404 for non-existent album', async () => {
      const response = await request(app).delete('/albums/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Album not found');
    });
  });
});
