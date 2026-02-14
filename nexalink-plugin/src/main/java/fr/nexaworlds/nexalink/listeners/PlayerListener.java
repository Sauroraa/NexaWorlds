package fr.nexaworlds.nexalink.listeners;

import com.google.gson.JsonObject;
import fr.nexaworlds.nexalink.NexaLink;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.event.player.PlayerQuitEvent;

public class PlayerListener implements Listener {

    private final NexaLink plugin;

    public PlayerListener(NexaLink plugin) {
        this.plugin = plugin;
    }

    @EventHandler
    public void onPlayerJoin(PlayerJoinEvent event) {
        plugin.getServer().getScheduler().runTaskAsynchronously(plugin, () -> {
            try {
                JsonObject data = new JsonObject();
                data.addProperty("username", event.getPlayer().getName());
                data.addProperty("uuid", event.getPlayer().getUniqueId().toString());
                data.addProperty("action", "join");

                plugin.getApiClient().post("/nexalink/player-event", data);
            } catch (Exception e) {
                plugin.getLogger().warning("Failed to notify player join: " + e.getMessage());
            }
        });
    }

    @EventHandler
    public void onPlayerQuit(PlayerQuitEvent event) {
        plugin.getServer().getScheduler().runTaskAsynchronously(plugin, () -> {
            try {
                JsonObject data = new JsonObject();
                data.addProperty("username", event.getPlayer().getName());
                data.addProperty("uuid", event.getPlayer().getUniqueId().toString());
                data.addProperty("action", "quit");

                plugin.getApiClient().post("/nexalink/player-event", data);
            } catch (Exception e) {
                plugin.getLogger().warning("Failed to notify player quit: " + e.getMessage());
            }
        });
    }
}
